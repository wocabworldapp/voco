"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, BookOpen, ArrowLeft, Target, Zap, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Learning
            </Link>
          </Button>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your VOCO Dashboard
          </h1>
          <p className="text-gray-600">
            Track your vocabulary learning progress and achievements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Words Learned */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Words Learned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-1">0</div>
              <p className="text-sm text-gray-600">Total vocabulary</p>
            </CardContent>
          </Card>

          {/* Study Streak */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-green-600" />
                Study Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-1">0</div>
              <p className="text-sm text-gray-600">Days in a row</p>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-purple-600" />
                Languages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 mb-1">0</div>
              <p className="text-sm text-gray-600">Currently learning</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest vocabulary learning sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                No activity yet. Start learning to see your progress here!
              </p>
              <Button asChild>
                <Link href="/">
                  Start Learning
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Learning Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Learning Progress
            </CardTitle>
            <CardDescription>
              Track your vocabulary mastery across different languages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Words Mastered</span>
                <span className="text-sm font-medium">0%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Weekly Goal</span>
                <span className="text-sm font-medium">0/50 words</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" asChild>
                    <Link href="/">Practice Vocabulary</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/">Review Words</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}