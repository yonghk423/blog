"use client"

import {useState} from "react"

export function MailButton({email}: {email: string}) {
  const [label, setLabel] = useState("Mail")

  async function copyMail() {
    if (!email) return
    await navigator.clipboard.writeText(email)
    setLabel("Copied")
    window.setTimeout(() => setLabel("Mail"), 2000)
  }

  return (
    <button className="header__mail hover-line" type="button" onClick={copyMail}>
      <span>{label}</span>
    </button>
  )
}
