export interface BaseProfile {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  role: 'student' | 'teacher';
  status: string;
  isActive: boolean;
  isOnboarded: boolean;
  joinedAt: string;
  lastActive: string;
}

export interface StudentProfile extends BaseProfile {
  role: 'student';
}

export interface TeacherProfile extends BaseProfile {
  role: 'teacher';
}

export interface StudentData {
  role: 'student';
  profileCard: StudentProfile;
  statCards: { label: string; value: number | string }[];
  roleInfo: {
    username: string;
    totalXp: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string;
  };
  chartData: {
    monthlyPerformance: {
      month: string;
      completedTasks: number;
      grammar: number;
      reading: number;
      vocabulary: number;
      overall: number;
      xp: number;
    }[];
    skillProgress: {
      skill: string;
      totalTasks: number;
      completedTasks: number;
      avgScore: number;
      totalScore: number;
    }[];
    attemptPerformance: {
      taskTitle: string;
      taskType: string;
      percentage: number;
      xpEarned: number;
      isPassed: boolean;
      completedAt: string;
    }[];
  };
  tables: {
    enrolledClasses: {
      id: string;
      name: string;
      subject: string;
      color: string;
      createdAt: string;
    }[];
    recentAttempts: {
      id: string;
      taskTitle: string;
      taskType: string;
      status: string;
      percentage: number;
      xpEarned: number;
      isPassed: boolean;
      startedAt: string;
      completedAt: string;
    }[];
    badges: {
      id: string;
      badgeId: string;
      name: string;
      description: string;
      iconName: string;
      progress: number;
      earnedAt: string;
    }[];
  };
}

export interface TeacherData {
  role: 'teacher';
  profileCard: TeacherProfile;
  statCards: { label: string; value: number | string }[];
  roleInfo: {
    subject: string;
    institution: string;
    bio: string;
  };
  chartData: {
    taskCreation: {
      taskTitle: string;
      taskType: string;
      status: string;
      questions: number;
      attempts: number;
      createdAt: string;
    }[];
    classOverview: {
      className: string;
      subject: string;
      students: number;
      tasks: number;
      maxStudents: number;
    }[];
  };
  tables: {
    classes: {
      id: string;
      name: string;
      subject: string;
      color: string;
      maxStudents: number;
      totalStudents: number;
      totalTasks: number;
      createdAt: string;
    }[];
    recentTasks: {
      id: string;
      title: string;
      type: string;
      status: string;
      isPublic: boolean;
      totalQuestions: number;
      totalAttempts: number;
      createdAt: string;
    }[];
  };
}