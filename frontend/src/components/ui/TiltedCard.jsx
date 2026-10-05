import React, { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function TiltedCard({
  children,
  imageSrc,
  altText = 'Card image',
  captionText = '',
  containerHeight = '100%',
  containerWidth = '100%',
  imageHeight = '100%',
  imageWidth = '100%',
  rotateAmplitude = 12,
  scaleOnHover = 1.03,
  showMobileWarning = false,
  showTooltip = false,
  displayOverlayContent = false,
  overlayContent = null,
  className = '',
  isSelected = false,
  hasOtherSelected = false,
  onClick,
}) {
  const ref = useRef(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 25 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 25 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [rotateAmplitude, -rotateAmplitude])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-rotateAmplitude, rotateAmplitude])

  const [isHovered, setIsHovered] = useState(false)

  // Hover and tilt are disabled on non-selected cards whenever any card is selected
  const canHover = !hasOtherSelected && !isSelected

  useEffect(() => {
    if (!canHover) {
      setIsHovered(false)
      x.set(0)
      y.set(0)
    }
  }, [canHover, x, y])

  const handleMouseMove = (e) => {
    if (!ref.current || !canHover) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseEnter = () => {
    if (!canHover) return
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX: canHover && isHovered ? rotateX : 0,
        rotateY: canHover && isHovered ? rotateY : 0,
        transformStyle: 'flat',
        perspective: 1000,
        height: containerHeight,
        width: containerWidth,
        backfaceVisibility: 'hidden',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      }}
      animate={{
        scale: isSelected ? 1.04 : canHover && isHovered ? scaleOnHover : hasOtherSelected ? 0.95 : 1,
        y: isSelected ? -8 : canHover && isHovered ? -4 : 0,
        opacity: hasOtherSelected ? 0.55 : 1,
        zIndex: isSelected ? 40 : canHover && isHovered ? 20 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 24,
      }}
      className={`relative select-none cursor-pointer ${className}`}
    >
      <div className="w-full h-full">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={altText}
            style={{ width: imageWidth, height: imageHeight }}
            className="w-full h-full object-cover rounded-2xl"
          />
        ) : null}

        {children}

        {displayOverlayContent && overlayContent && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            {overlayContent}
          </div>
        )}

        {showTooltip && captionText && (
          <div className="absolute bottom-2 left-2 z-20 px-2 py-1 bg-black/70 text-white text-xs rounded shadow">
            {captionText}
          </div>
        )}
      </div>
    </motion.div>
  )
}
