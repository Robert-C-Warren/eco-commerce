import React, { useState, useEffect } from "react";
import { BiArrowToTop } from "react-icons/bi";
import "./ScrollToTop.scss"

const ScrollToTop = () => {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const toggleVisible = () => {
            setVisible(window.scrollY > 300)
        }

        window.addEventListener("scroll", toggleVisible)
        return () => window.removeEventListener("scroll", toggleVisible)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return (
        visible && (
            <button className="scroll-to-top" onClick={scrollToTop}>
                <BiArrowToTop />
            </button>
        )
    )
}

export default ScrollToTop;