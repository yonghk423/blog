"use client"

import {useState} from "react"

export function MailButton({email}: {email: string}) {
  const [label, setLabel] = useState("Mail")

  async function copyMail() {
    if (!email) return
    try {
      await navigator.clipboard.writeText(email)
      setLabel("Copied")
      window.setTimeout(() => setLabel("Mail"), 2000)
    } catch {
      setLabel("Mail")
    }
  }

  if (!email) {
    return (
      <button className="header__mail hover-line" type="button">
        <span>{label}</span>
      </button>
    )
  }

  return (
    <a className="header__mail hover-line" href={`mailto:${email}`} onClick={copyMail}>
      <span>{label}</span>
    </a>
  )
}
