/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Search, X, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAddStudentsToClassMutation, useStudentFinderQuery } from "@/api/class";
import { useParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

interface Student {
  username: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
  };
}

export const InviteStudentDialog = ({ open, onOpenChange }: Props) => {
  const [searchEmail, setSearchEmail] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [searchResult, setSearchResult] = useState<Student | null>(null);
  const { classId } = useParams() as { classId: string };
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const { data: foundStudent, isFetching } = useStudentFinderQuery(
    debouncedEmail,

  );

  const { mutateAsync: addStudentsToClass, isPending: isAdding } = 
    useAddStudentsToClassMutation(classId);

  // Debounce search email
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (searchEmail.trim()) {
      debounceTimerRef.current = setTimeout(() => {
        setDebouncedEmail(searchEmail);
      }, 500);
    } else {
      setDebouncedEmail("");
      setSearchResult(null);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchEmail]);

  // Handle search results - only display, don't auto-add
  useEffect(() => {
    if (debouncedEmail && foundStudent && !isFetching) {
      const student = foundStudent as Student;
      
      // Check if student is already selected
      const isAlreadySelected = selectedStudents.some(s => s.user.id === student.user.id);
      
      if (isAlreadySelected) {
        toast.warning(`${student.user.firstName} ${student.user.lastName} is already in the list`);
        setSearchResult(null);
      } else {
        setSearchResult(student);
      }
    } else if (debouncedEmail && !foundStudent && !isFetching) {
      setSearchResult(null);
      toast.error("No student found with this email");
    }
  }, [foundStudent, isFetching, debouncedEmail, selectedStudents]);

  const handleAddToSelection = () => {
    if (searchResult) {
      setSelectedStudents([...selectedStudents, searchResult]);
      toast.success(`Added: ${searchResult.user.firstName} ${searchResult.user.lastName}`);
      setSearchResult(null);
      setSearchEmail("");
      setDebouncedEmail("");
    }
  };

  const handleRemoveStudent = (studentId: string) => {
    setSelectedStudents(selectedStudents.filter(s => s.user.id !== studentId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedStudents.length === 0) {
      toast.error("Please add at least one student");
      return;
    }

    try {
      const studentIds = selectedStudents.map(s => s.user.id);
      await addStudentsToClass(studentIds);
      
      toast.success(
        `Successfully added ${selectedStudents.length} student${selectedStudents.length > 1 ? 's' : ''} to the class`
      );
      
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to add students to class");
    }
  };

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchEmail("");
      setDebouncedEmail("");
      setSelectedStudents([]);
      setSearchResult(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Add Students to Class
          </DialogTitle>
          <DialogDescription>
            Search for students by email and add them to this class.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Search Section */}
          <div className="space-y-1.5">
            <Label>Search Student by Email</Label>
            <div className="relative">
              <Input
                type="email"
                placeholder="student@email.com"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                disabled={isAdding}
                className="w-full pr-10"
                autoFocus
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isFetching && searchEmail && (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                )}
                {!isFetching && searchEmail && !searchResult && (
                  <Search className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Start typing an email address to search for registered students
            </p>
          </div>

          {/* Search Result - Add to Selection */}
          {searchResult && !isFetching && (
            <div className="space-y-2">
              <Label>Search Result</Label>
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-md border border-primary/20">
                <div className="flex-1 min-w-0">
                  <div className="font-medium">
                    {searchResult.user.firstName} {searchResult.user.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {searchResult.user.email}
                  </div>
                  {searchResult.username && (
                    <div className="text-xs text-muted-foreground">
                      @{searchResult.username}
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddToSelection}
                  className="gap-1 shrink-0 ml-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </Button>
              </div>
            </div>
          )}

          {/* Selected Students List */}
          {selectedStudents.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>
                  Selected Students ({selectedStudents.length})
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedStudents([])}
                  className="h-auto p-0 text-xs text-destructive hover:text-destructive"
                >
                  Clear all
                </Button>
              </div>
              <ScrollArea className="h-auto max-h-64 rounded-md border">
                <div className="space-y-1 p-2">
                  {selectedStudents.map((student) => (
                    <div
                      key={student.user.id}
                      className="flex items-center justify-between p-2 bg-muted/50 rounded-md hover:bg-muted transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {student.user.firstName} {student.user.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          {student.user.email}
                        </div>
                        {student.username && (
                          <div className="text-xs text-muted-foreground">
                            @{student.username}
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveStudent(student.user.id)}
                        className="h-8 w-8 p-0 shrink-0 ml-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Empty State */}
          {selectedStudents.length === 0 && !searchResult && (
            <div className="text-center py-8 border rounded-md bg-muted/30">
              <UserPlus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No students added yet
              </p>
              <p className="text-xs text-muted-foreground">
                Type an email address to search and add students
              </p>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isAdding}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="gap-1.5"
              disabled={selectedStudents.length === 0 || isAdding}
            >
              {isAdding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-3.5 h-3.5" />
              )}
              Add {selectedStudents.length > 0 && `(${selectedStudents.length})`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};