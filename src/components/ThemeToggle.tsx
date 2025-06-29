"use client"

import type React from "react"
import { Button } from "antd"
import { SunOutlined, MoonOutlined } from "@ant-design/icons"
import { useTheme } from "../contexts/ThemeContext"

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <Button
      type="text"
      icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
      onClick={toggleTheme}
      className="theme-toggle"
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    />
  )
}

export default ThemeToggle
