import { useSupabaseAuth } from "@/_core/hooks/useSupabaseAuth";
import PortalLayout from "@/components/PortalLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, FileText, Link as LinkIcon, Clock, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function Submissions() {
  const { user, loading } = useSupabaseAuth();
  const [, setLocation] = useLocation();
  const [submissionsEnabled] = useState(false); // Will be controlled by admin settings

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/signin");
    }
  }, [loading, user, setLocation]);

  if (loading) {
    return (
      <PortalLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Submission</h1>
          <p className="text-gray-600 mt-2">Submit your hackathon project for review</p>
        </div>

        {!submissionsEnabled ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Submissions Not Yet Open</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Project submissions will be enabled by the organizers closer to the hackathon deadline.
                  Check back later or watch for announcements.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Submission Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-purple-600" />
                    Submit Your Project
                  </CardTitle>
                  <CardDescription>
                    Fill out the details below to submit your project for review
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div>
                      <Label htmlFor="projectName">Project Name *</Label>
                      <Input
                        id="projectName"
                        placeholder="Enter your project name"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="tagline">Tagline *</Label>
                      <Input
                        id="tagline"
                        placeholder="A short description of your project"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your project in detail. What problem does it solve? How does it work?"
                        rows={6}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="techStack">Tech Stack</Label>
                      <Input
                        id="techStack"
                        placeholder="e.g., React, Node.js, PostgreSQL, AWS"
                        className="mt-1"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="githubUrl" className="flex items-center gap-2">
                          <LinkIcon className="h-4 w-4" />
                          GitHub Repository
                        </Label>
                        <Input
                          id="githubUrl"
                          placeholder="https://github.com/..."
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="demoUrl" className="flex items-center gap-2">
                          <LinkIcon className="h-4 w-4" />
                          Live Demo URL
                        </Label>
                        <Input
                          id="demoUrl"
                          placeholder="https://..."
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="videoUrl" className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4" />
                        Demo Video URL
                      </Label>
                      <Input
                        id="videoUrl"
                        placeholder="YouTube or Loom link"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="devpostUrl" className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4" />
                        Devpost Submission URL
                      </Label>
                      <Input
                        id="devpostUrl"
                        placeholder="https://devpost.com/..."
                        className="mt-1"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Submit Project
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Submission Status */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Submission Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium text-gray-900">Not Submitted</p>
                      <p className="text-sm text-gray-500">Submit your project before the deadline</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Submission Checklist</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2 text-gray-600">
                        <FileText className="h-4 w-4" />
                        Project name and description
                      </li>
                      <li className="flex items-center gap-2 text-gray-600">
                        <LinkIcon className="h-4 w-4" />
                        GitHub repository link
                      </li>
                      <li className="flex items-center gap-2 text-gray-600">
                        <LinkIcon className="h-4 w-4" />
                        Demo video (recommended)
                      </li>
                      <li className="flex items-center gap-2 text-gray-600">
                        <LinkIcon className="h-4 w-4" />
                        Devpost submission
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
