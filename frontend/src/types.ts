
export type QuestionType = 'boolean' | 'input' | 'checkbox';

export interface QuizOption {
  id?: string;          
  text: string;        
  isCorrect: boolean;  
}

export interface QuizQuestion {
  id?: string;               
  type: QuestionType;       
  questionText: string;     
  options?: QuizOption[];   
  correctAnswer?: string | boolean; 
}

export interface Quiz {
  id?: number;
  title: string;
  createdBy: number;         
  questions: QuizQuestion[];
  createdAt?: Date;
  updatedAt?: Date;
}