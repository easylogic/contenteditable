/**
 * Touch event utilities for mobile interactions
 */

export interface TouchGesture {
  type: 'tap' | 'double-tap' | 'long-press' | 'pinch' | 'pan' | 'swipe';
  touches: Touch[];
  timestamp: number;
  scale?: number;
  distance?: number;
  velocity?: { x: number; y: number };
}

export interface TouchConfig {
  tapTimeout: number;
  doubleTapTimeout: number;
  longPressTimeout: number;
  pinchThreshold: number;
  swipeThreshold: number;
  panThreshold: number;
}

export class TouchHandler {
  private config: TouchConfig;
  private gestures: TouchGesture[] = [];
  private lastTap: number = 0;
  private longPressTimer: number | null = null;
  private initialDistance: number = 0;
  private initialTouches: Touch[] = [];
  private callbacks: Map<string, (gesture: TouchGesture) => void> = new Map();

  constructor(config: Partial<TouchConfig> = {}) {
    this.config = {
      tapTimeout: 300,
      doubleTapTimeout: 300,
      longPressTimeout: 500,
      pinchThreshold: 10,
      swipeThreshold: 50,
      panThreshold: 10,
      ...config,
    };
  }

  /**
   * Register a callback for specific gesture type
   */
  on(gestureType: string, callback: (gesture: TouchGesture) => void): void {
    this.callbacks.set(gestureType, callback);
  }

  /**
   * Remove a callback
   */
  off(gestureType: string): void {
    this.callbacks.delete(gestureType);
  }

  /**
   * Handle touch start event
   */
  handleTouchStart(event: TouchEvent): void {
    const touches = Array.from(event.touches);
    this.initialTouches = touches;
    
    // Clear long press timer
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    if (touches.length === 1) {
      // Single touch - start long press timer
      this.longPressTimer = window.setTimeout(() => {
        this.emitGesture({
          type: 'long-press',
          touches,
          timestamp: Date.now(),
        });
      }, this.config.longPressTimeout);
    } else if (touches.length === 2) {
      // Two touches - calculate initial distance for pinch
      this.initialDistance = this.calculateDistance(touches);
    }
  }

  /**
   * Handle touch move event
   */
  handleTouchMove(event: TouchEvent): void {
    const touches = Array.from(event.touches);
    
    // Clear long press timer on move
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    if (touches.length === 1) {
      // Single touch - pan gesture
      const touch = touches[0];
      const initialTouch = this.initialTouches[0];
      
      if (initialTouch) {
        const deltaX = touch.clientX - initialTouch.clientX;
        const deltaY = touch.clientY - initialTouch.clientY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance > this.config.panThreshold) {
          this.emitGesture({
            type: 'pan',
            touches,
            timestamp: Date.now(),
            velocity: { x: deltaX, y: deltaY },
          });
        }
      }
    } else if (touches.length === 2) {
      // Two touches - pinch gesture
      const currentDistance = this.calculateDistance(touches);
      const scale = currentDistance / this.initialDistance;
      
      if (Math.abs(scale - 1) > this.config.pinchThreshold / 100) {
        this.emitGesture({
          type: 'pinch',
          touches,
          timestamp: Date.now(),
          scale,
          distance: currentDistance,
        });
      }
    }
  }

  /**
   * Handle touch end event
   */
  handleTouchEnd(event: TouchEvent): void {
    const touches = Array.from(event.changedTouches);
    
    // Clear long press timer
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    if (touches.length === 1) {
      const touch = touches[0];
      const initialTouch = this.initialTouches[0];
      
      if (initialTouch) {
        const deltaX = touch.clientX - initialTouch.clientX;
        const deltaY = touch.clientY - initialTouch.clientY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const deltaTime = Date.now() - (this.lastTap || 0);
        
        if (distance < this.config.tapTimeout) {
          // Tap detected
          if (deltaTime < this.config.doubleTapTimeout) {
            // Double tap
            this.emitGesture({
              type: 'double-tap',
              touches,
              timestamp: Date.now(),
            });
          } else {
            // Single tap
            this.emitGesture({
              type: 'tap',
              touches,
              timestamp: Date.now(),
            });
          }
          this.lastTap = Date.now();
        } else if (distance > this.config.swipeThreshold) {
          // Swipe detected
          this.emitGesture({
            type: 'swipe',
            touches,
            timestamp: Date.now(),
            velocity: { x: deltaX, y: deltaY },
          });
        }
      }
    }
    
    // Reset initial touches
    this.initialTouches = [];
    this.initialDistance = 0;
  }

  /**
   * Calculate distance between two touches
   */
  private calculateDistance(touches: Touch[]): number {
    if (touches.length !== 2) return 0;
    
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Emit gesture to registered callbacks
   */
  private emitGesture(gesture: TouchGesture): void {
    this.gestures.push(gesture);
    
    // Keep only last 50 gestures
    if (this.gestures.length > 50) {
      this.gestures = this.gestures.slice(-50);
    }
    
    const callback = this.callbacks.get(gesture.type);
    if (callback) {
      callback(gesture);
    }
  }

  /**
   * Get recent gestures
   */
  getRecentGestures(count: number = 10): TouchGesture[] {
    return this.gestures.slice(-count);
  }

  /**
   * Clear all gestures
   */
  clearGestures(): void {
    this.gestures = [];
  }

  /**
   * Destroy the touch handler
   */
  destroy(): void {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
    this.callbacks.clear();
    this.gestures = [];
  }
}

/**
 * Check if device is touch capable
 */
export function isTouchDevice(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
}

/**
 * Get touch event type name
 */
export function getTouchEventType(event: TouchEvent): string {
  switch (event.type) {
    case 'touchstart':
      return 'touch-start';
    case 'touchmove':
      return 'touch-move';
    case 'touchend':
      return 'touch-end';
    case 'touchcancel':
      return 'touch-cancel';
    default:
      return 'touch-unknown';
  }
}

/**
 * Convert touch coordinates to element-relative coordinates
 */
export function getTouchRelativeCoords(touch: Touch, element: HTMLElement): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  return {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top,
  };
}