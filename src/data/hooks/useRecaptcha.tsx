import { useState, useEffect } from "react";
import { auth } from "../../config/firebase";
import { RecaptchaVerifier } from "firebase/auth";

export default function useRecaptcha() {
    const [recaptcha, setRecaptcha] = useState<RecaptchaVerifier>();

    useEffect(() => {
        const r = new RecaptchaVerifier(auth, "recaptcha", {
            size: "invisible",
        });
        setRecaptcha(r);

        return () => {
            r.clear();
        };
    }, []);

    return recaptcha as RecaptchaVerifier;
}
