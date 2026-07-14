

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {

  Calendar,
  CheckCircle,
  Clock,
  Flame,
  Award,
  User,
  FileText,
  Activity,
} from 'lucide-react';
import { StudentData } from './interface';
import { formatDate, getInitials } from './UserInfos';

export const StudentDashboard: React.FC<{ data: StudentData }> = ({ data }) => {
  const { profileCard, statCards, roleInfo, chartData, tables } = data;
  const { monthlyPerformance, skillProgress, attemptPerformance } = chartData;

  // Transform skill progress for radar chart
  const radarData = skillProgress.map((skill) => ({
    subject: skill.skill,
    score: skill.avgScore,
    fullMark: 100,
  }));

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profileCard.avatarUrl || undefined} />
            <AvatarFallback className="bg-primary/10 text-lg">
              {getInitials(profileCard.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{profileCard.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Badge variant="secondary" className="gap-1">
                <User className="h-3 w-3" />
                {roleInfo.username}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Calendar className="h-3 w-3" />
                Joined {formatDate(profileCard.joinedAt)}
              </Badge>
              {profileCard.isActive && (
                <Badge variant="default" className="bg-green-500 gap-1">
                  <Activity className="h-3 w-3" />
                  Active
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            View Report
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* XP and Streak Highlights */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total XP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleInfo.totalXp}</div>
            <Progress value={(roleInfo.totalXp % 1000) / 10} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Level {roleInfo.level} · {(roleInfo.totalXp % 1000)}/1000 XP to next level
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="text-2xl font-bold">{roleInfo.currentStreak} days</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Longest streak: {roleInfo.longestStreak} days
              </p>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              Last active: {formatDate(roleInfo.lastActiveDate)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="attempts">Recent Attempts</TabsTrigger>
          <TabsTrigger value="badges">Badges & Classes</TabsTrigger>
        </TabsList>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance Overview</CardTitle>
              <CardDescription>Your progress across different skills each month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" domain={[0, 100]} />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="grammar"
                      stroke="#3b82f6"
                      name="Grammar"
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="reading"
                      stroke="#10b981"
                      name="Reading"
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="vocabulary"
                      stroke="#f59e0b"
                      name="Vocabulary"
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="overall"
                      stroke="#8b5cf6"
                      name="Overall"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="xp"
                      stroke="#ef4444"
                      name="XP Earned"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Task Completion Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completedTasks" fill="#3b82f6" name="Completed Tasks" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Skill Proficiency Radar</CardTitle>
                <CardDescription>Your scores across different skill areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skill Progress Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skillProgress.map((skill) => (
                    <div key={skill.skill}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{skill.skill}</span>
                        <span>{skill.avgScore}%</span>
                      </div>
                      <Progress value={skill.avgScore} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{skill.completedTasks}/{skill.totalTasks} tasks</span>
                        <span>{skill.totalScore} total points</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Task Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attemptPerformance.map((attempt, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium">{attempt.taskTitle}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary">{attempt.taskType}</Badge>
                        <span>{formatDate(attempt.completedAt)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">{attempt.percentage}%</span>
                        {attempt.isPassed ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">+{attempt.xpEarned} XP</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attempts Tab */}
        <TabsContent value="attempts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>XP Earned</TableHead>
                    <TableHead>Completed At</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tables.recentAttempts.map((attempt) => (
                    <TableRow key={attempt.id}>
                      <TableCell className="font-medium">{attempt.taskTitle}</TableCell>
                      <TableCell>{attempt.taskType}</TableCell>
                      <TableCell>{attempt.percentage}%</TableCell>
                      <TableCell>{attempt.xpEarned}</TableCell>
                      <TableCell>{formatDate(attempt.completedAt)}</TableCell>
                      <TableCell>
                        {attempt.isPassed ? (
                          <Badge className="bg-green-500">Passed</Badge>
                        ) : (
                          <Badge variant="destructive">Failed</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Badges & Classes Tab */}
        <TabsContent value="badges" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {tables.badges.map((badge) => (
                    <div key={badge.id} className="flex items-center gap-3 rounded-lg border p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{badge.name}</p>
                        <p className="text-xs text-muted-foreground">{badge.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Earned: {formatDate(badge.earnedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enrolled Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tables.enrolledClasses.map((classItem) => (
                    <div key={classItem.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: classItem.color }} />
                        <div>
                          <p className="font-medium">{classItem.name}</p>
                          <p className="text-xs text-muted-foreground">{classItem.subject}</p>
                        </div>
                      </div>
                      <Badge variant="outline">Enrolled</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};