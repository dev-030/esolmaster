export type SignUpDtoRequestDto = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'admin';

  // student only
  username?: string;

  // teacher only
  subject?: string;
  institution?: string;
  bio?: string;
};


export type CompleteProfileDtoRequestDto = {
  // student only
  username?: string;
  // teacher only
  subject?: string;
  institution?: string;
  bio?: string;
};