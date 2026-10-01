declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export type TodoDto = {
  id: string;
  title: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
};