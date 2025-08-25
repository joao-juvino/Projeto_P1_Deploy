// app/interview/page.tsx
import ProtectedRoute from "../components/ProtectedRoute";
import InterviewFlow from "../components/interview/InterviewFlow";

export default function InterviewPage() {
  return (
    <ProtectedRoute>
      <div className="bg-[#f2f4f7] min-h-screen p-5">
        <InterviewFlow />
      </div>
    </ProtectedRoute>
  );
}
