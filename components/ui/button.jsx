import * as React from "react"

const Button = React.forwardRef(({ 
  className = "", 
  variant = "default", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const baseClass = "custom-button"
  
  const variantClasses = {
    default: "",
    secondary: "custom-button-secondary",
    ghost: "custom-button-ghost",
    outline: "custom-button-secondary",
    destructive: "custom-button-secondary",
    link: "custom-button-ghost"
  }
  
  const sizeClasses = {
    default: "",
    sm: "custom-p-2",
    lg: "custom-p-6",
    icon: "custom-p-4"
  }
  
  const classes = [
    baseClass,
    variantClasses[variant] || "",
    sizeClasses[size] || "",
    className
  ].filter(Boolean).join(" ")
  
  return (
    <button
      className={classes}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export { Button }


