"use client"

import React, {
  ComponentPropsWithoutRef,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react"
import { AnimatePresence, motion, MotionProps } from "motion/react"

import { cn } from "@/lib/utils"

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const animations: MotionProps = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, originY: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 40 },
  }

  return (
    <motion.div {...animations} layout className="mx-auto w-full">
      {children}
    </motion.div>
  )
}

export interface AnimatedListProps extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode
  delay?: number
}

export const AnimatedList = React.memo(
  ({ children, className, delay = 1000, ...props }: AnimatedListProps) => {
    const [index, setIndex] = useState(0)
    const [isInView, setIsInView] = useState(false)
    const [animationComplete, setAnimationComplete] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const childrenArray = useMemo(
      () => React.Children.toArray(children),
      [children]
    )

    // Intersection Observer to detect when component is in viewport
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isInView) {
            setIsInView(true)
          }
        },
        { threshold: 0.2 } // Trigger when 20% visible
      )

      if (containerRef.current) {
        observer.observe(containerRef.current)
      }

      return () => observer.disconnect()
    }, [isInView])

    // Animation logic - only starts when in view
    useEffect(() => {
      if (isInView && index < childrenArray.length - 1) {
        const timeout = setTimeout(() => {
          setIndex((prevIndex) => prevIndex + 1)
        }, delay)

        return () => clearTimeout(timeout)
      } else if (isInView && index === childrenArray.length - 1) {
        // Mark animation as complete
        setAnimationComplete(true)
      }
    }, [index, delay, childrenArray.length, isInView])

    const itemsToShow = useMemo(() => {
      if (animationComplete) {
        // Show all items when animation is complete
        return childrenArray.reverse()
      }
      // During animation, show last 8 items (push notification effect)
      const result = childrenArray.slice(0, index + 1).reverse().slice(0, 8);
      return result
    }, [index, childrenArray, animationComplete])

    return (
      <div
        ref={containerRef}
        className={cn(`flex flex-col items-center gap-4`, className)}
        {...props}
      >
        <AnimatePresence>
          {itemsToShow.map((item) => (
            <AnimatedListItem key={(item as React.ReactElement).key}>
              {item}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    )
  }
)

AnimatedList.displayName = "AnimatedList"
