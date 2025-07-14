import Image from "next/image";
import styles from "./page.module.css";
import Form from "./components/Form";

export default function Home() {
    return (
        <div className="bg-[#f2f4f7] min-h-screen p-5">
            <Form/>
        </div>
    );
}
