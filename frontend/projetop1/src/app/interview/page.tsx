// app/interview/page.tsx
"use client";
import { Select } from "antd";
import ProtectedRoute from "../components/ProtectedRoute";
import InterviewFlow from "../components/interview/InterviewFlow";
import { BookText, CircleX, Code, Lightbulb, Mic, Tag } from "lucide-react";
import CodeEditor from "../components/CodeEditor";

export default function InterviewPage() {
  const handleChangeLanguage = () => { };
  return (
    <ProtectedRoute>


      <div className="flex bg-[#f2f4f7] p-5">
        <div className="flex flex-col gap-5 w-1/2">
          <div className="bg-white p-10 rounded-2xl">
            <div className="flex text-2xl font-bold items-center">
              <BookText className="mr-2" />
              <h3>Description</h3>
            </div>
            <h1 className="my-5 text-4xl font-bold">1. Two Sum</h1>
            <div className="mb-10 flex gap-4 font-bold">
              <div className="flex justify-center items-center px-6 py-2 rounded-full bg-[#F2F4F7]">
                <span className="text-green-500">Easy</span>
              </div>
              <div className="flex gap-2 justify-center items-center px-6 py-2 rounded-full bg-[#F2F4F7]">
                <Tag />
                <span>Topics</span>
              </div>
              <div className="flex gap-2 justify-center items-center px-6 py-2 rounded-full bg-[#F2F4F7]">
                <Lightbulb />
                <span>Hint</span>
              </div>
            </div>
            <div>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis,
                temporibus repellat? Optio velit similique maxime repellendus
                consectetur. Cum, eum fugiat blanditiis ut sapiente adipisci magni
                numquam et sint corrupti explicabo!
              </p>
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magni
                reiciendis architecto qui doloribus corporis, rem eos similique
                fugit aut! Provident sit qui omnis deserunt incidunt architecto
                nemo consequuntur magnam ad!
              </p>
            </div>
          </div>
          <div className="flex bg-white p-10 rounded-2xl">
            <InterviewFlow />
          </div> 
        </div>
        <div className="ml-5 w-1/2 flex flex-col bg-white p-10 rounded-2xl">
          <div className="mb-5 flex items-center gap-3 font-bold text-2xl">
            <Code size={40} className="text-green-500" />
            <h2>Code</h2>
          </div>
          <Select
            defaultValue="js"
            style={{ width: 120 }}
            onChange={handleChangeLanguage}
            options={[{ value: "js", label: "Javascript" }]}
            className="!mb-5"
          />
          <CodeEditor />
        </div>
      </div>
    </ProtectedRoute>
  );
}
