
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

interface QuizComponentProps {
  lectureId: string;
}

interface Question {
  id: string;
  question: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  options: string[];
  explanation?: string;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ lectureId }) => {
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<any | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: string}>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState<{[key: string]: string}>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizAttempts, setQuizAttempts] = useState<any[]>([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        // Fetch quiz for this lecture
        const { data: quizData, error: quizError } = await supabase
          .from('quizzes')
          .select('*')
          .eq('lecture_id', lectureId)
          .single();
        
        if (quizError && quizError.code !== 'PGRST116') throw quizError;
        
        if (quizData) {
          setQuiz(quizData);
          setTimeRemaining(quizData.time_limit ? quizData.time_limit * 60 : 0);
          
          // Fetch quiz questions
          const { data: questionsData, error: questionsError } = await supabase
            .from('quiz_questions')
            .select('*')
            .eq('quiz_id', quizData.id);
          
          if (questionsError) throw questionsError;
          
          if (questionsData) {
            setQuestions(questionsData.map(q => ({
              ...q,
              options: Array.isArray(q.options) ? q.options : []
            })));
            
            // Prepare correct answers object
            const answers: {[key: string]: string} = {};
            questionsData.forEach(q => {
              if (typeof q.correct_answer === 'string') {
                answers[q.id] = q.correct_answer;
              } else if (Array.isArray(q.correct_answer) && q.correct_answer.length > 0) {
                answers[q.id] = q.correct_answer[0];
              }
            });
            setCorrectAnswers(answers);
          }
          
          // Fetch past attempts if user is logged in
          if (user) {
            const { data: attemptsData, error: attemptsError } = await supabase
              .from('quiz_attempts')
              .select('*')
              .eq('quiz_id', quizData.id)
              .eq('user_id', user.id)
              .order('created_at', { ascending: false });
            
            if (!attemptsError && attemptsData) {
              setQuizAttempts(attemptsData);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (lectureId) {
      fetchQuiz();
    }
  }, [lectureId, user]);

  // Timer countdown
  useEffect(() => {
    let timer: number | undefined;
    
    if (quiz && timeRemaining > 0 && !quizSubmitted) {
      timer = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [quiz, timeRemaining, quizSubmitted]);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!user || !quiz) return;
    
    try {
      // Calculate score
      let correctCount = 0;
      
      questions.forEach(question => {
        const userAnswer = selectedAnswers[question.id];
        if (userAnswer && correctAnswers[question.id] === userAnswer) {
          correctCount++;
        }
      });
      
      const calculatedScore = Math.round((correctCount / questions.length) * 100);
      setScore(calculatedScore);
      
      // Determine if passed
      const passed = calculatedScore >= quiz.pass_score;
      
      // Save attempt in database
      const { error } = await supabase
        .from('quiz_attempts')
        .insert({
          quiz_id: quiz.id,
          user_id: user.id,
          score: calculatedScore,
          passed: passed,
          answers: selectedAnswers,
          started_at: new Date(Date.now() - (quiz.time_limit * 60 - timeRemaining) * 1000).toISOString(),
          completed_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      setQuizSubmitted(true);
      toast.success(`Quiz completed with score: ${calculatedScore}%`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Error submitting quiz");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startNewAttempt = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setQuizSubmitted(false);
    setScore(0);
    if (quiz && quiz.time_limit) {
      setTimeRemaining(quiz.time_limit * 60);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Loading quiz...</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-8">
        <p>No quiz available for this lecture.</p>
      </div>
    );
  }

  if (quizSubmitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {score >= quiz.pass_score ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
            Quiz Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">{score}%</div>
              <p className="text-muted-foreground">
                {score >= quiz.pass_score ? "Passed!" : "Failed"}
              </p>
            </div>
            
            <Progress value={score} className="h-2 w-full" />
            
            <div className="grid grid-cols-2 gap-4 text-center mt-4">
              <div>
                <p className="text-sm text-muted-foreground">Passing Score</p>
                <p className="font-medium">{quiz.pass_score}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Score</p>
                <p className="font-medium">{score}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Questions</p>
                <p className="font-medium">{questions.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Correct Answers</p>
                <p className="font-medium">
                  {Object.keys(selectedAnswers).filter(
                    questionId => selectedAnswers[questionId] === correctAnswers[questionId]
                  ).length} / {questions.length}
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-semibold mb-4">Review Answers</h3>
              {questions.map((question, index) => (
                <div key={question.id} className="mb-6 p-4 border rounded-lg">
                  <p className="font-medium mb-2">
                    {index + 1}. {question.question}
                  </p>
                  
                  <div className="pl-4 border-l-2 border-muted mt-2">
                    <p className="mb-1">
                      Your answer: <span className={`font-medium ${
                        selectedAnswers[question.id] === correctAnswers[question.id] 
                          ? 'text-green-500' 
                          : 'text-red-500'
                      }`}>
                        {selectedAnswers[question.id] || "Not answered"}
                      </span>
                    </p>
                    <p className="text-green-500 font-medium">
                      Correct answer: {correctAnswers[question.id]}
                    </p>
                    {question.explanation && (
                      <p className="text-sm mt-2 text-muted-foreground">{question.explanation}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={startNewAttempt}>Try Again</Button>
        </CardFooter>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  if (quizAttempts.length > 0 && !quizSubmitted) {
    const bestAttempt = quizAttempts.reduce((best, current) => 
      current.score > best.score ? current : best, quizAttempts[0]);

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Previous Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Best Score</p>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold">{bestAttempt.score}%</span>
                    {bestAttempt.passed ? (
                      <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500 ml-2" />
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Attempts</p>
                  <p className="text-2xl font-bold">{quizAttempts.length}</p>
                </div>
                
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Last Attempt</p>
                  <p className="text-sm">
                    {new Date(quizAttempts[0].completed_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button onClick={startNewAttempt} className="w-full">
                  Start New Attempt
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Attempt History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quizAttempts.slice(0, 5).map((attempt, index) => (
                <div key={attempt.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">Attempt #{quizAttempts.length - index}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(attempt.completed_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{attempt.score}%</span>
                    {attempt.passed ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{quiz.title}</h2>
          <p className="text-muted-foreground text-sm">Pass score: {quiz.pass_score}%</p>
        </div>
        
        {quiz.time_limit && (
          <div className="bg-muted px-4 py-2 rounded-md flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="font-mono">{formatTime(timeRemaining)}</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
        <span>
          {Object.keys(selectedAnswers).length} of {questions.length} answered
        </span>
      </div>
      
      <Progress 
        value={(currentQuestionIndex + 1) / questions.length * 100}
        className="h-1"
      />
      
      {currentQuestion && (
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="mr-2">Q{currentQuestionIndex + 1}.</span>
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentQuestion.question_type === 'multiple_choice' && (
              <RadioGroup
                value={selectedAnswers[currentQuestion.id] || ''}
                onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
              >
                {currentQuestion.options.map((option, index) => (
                  <div className="flex items-center space-x-2 mb-3" key={index}>
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
            
            {currentQuestion.question_type === 'true_false' && (
              <RadioGroup
                value={selectedAnswers[currentQuestion.id] || ''}
                onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
              >
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="true" id="true" />
                  <Label htmlFor="true">True</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="false" />
                  <Label htmlFor="false">False</Label>
                </div>
              </RadioGroup>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            
            {currentQuestionIndex === questions.length - 1 ? (
              <Button onClick={handleSubmitQuiz}>Submit Quiz</Button>
            ) : (
              <Button onClick={handleNextQuestion}>Next</Button>
            )}
          </CardFooter>
        </Card>
      )}
      
      <div className="flex justify-between items-center mt-6 px-4">
        <div className="flex gap-1">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`h-8 w-8 flex items-center justify-center rounded-full text-xs ${
                index === currentQuestionIndex
                  ? 'bg-primary text-primary-foreground'
                  : selectedAnswers[questions[index].id]
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-muted'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        
        <Button onClick={handleSubmitQuiz}>Submit Quiz</Button>
      </div>
    </div>
  );
};

export default QuizComponent;
