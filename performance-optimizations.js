/**
 * ملف تحسينات الأداء لموقع غراب
 * يحتوي على تحسينات لسرعة الموقع وأداء الفيديوهات والصور
 */

class PerformanceOptimizer {
  constructor() {
    // تأخير التهيئة لضمان تحميل الصفحة أولاً
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }
  
  init() {
    try {
      this.optimizeImages();
      this.optimizeVideos();
      this.addIntersectionObserver();
      this.optimizeFonts();
      // إزالة مراقبة الأداء مؤقتاً لتجنب المشاكل
      // this.addPerformanceMonitoring();
    } catch (error) {
      console.log('Performance optimization error:', error);
    }
  }
  
  /**
   * تحسين الصور
   */
  optimizeImages() {
    try {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        // إضافة lazy loading فقط للصور التي لا تحتوي عليه
        if (!img.loading && !img.src.includes('data:')) {
          img.loading = 'lazy';
        }
        
        // لا نضيف will-change للصور لتجنب مشاكل التمرير
      });
    } catch (error) {
      console.log('Image optimization error:', error);
    }
  }
  
  /**
   * تحسين الفيديوهات
   */
  optimizeVideos() {
    try {
      const videos = document.querySelectorAll('video');
      videos.forEach(video => {
        // تحسين preload فقط إذا لم يكن محدداً
        if (!video.preload) {
          video.preload = 'metadata';
        }
        
        // إضافة attributes للأداء
        if (!video.hasAttribute('playsinline')) {
          video.setAttribute('playsinline', '');
        }
        
        // تحسين الأداء
        video.style.transform = 'translateZ(0)';
        video.style.backfaceVisibility = 'hidden';
        
        // إضافة event listeners محسنة
        video.addEventListener('loadedmetadata', () => {
          video.style.willChange = 'auto';
        });
      });
    } catch (error) {
      console.log('Video optimization error:', error);
    }
  }
  
  /**
   * إضافة Intersection Observer
   */
  addIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;
    
    try {
      // مراقبة العناصر المرئية
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // تحميل الفيديو عند ظهوره
            const video = entry.target.querySelector('video');
            if (video && video.dataset.src && !video.src) {
              video.src = video.dataset.src;
              video.load();
            }
            
            // تحميل الصورة عند ظهورها
            const img = entry.target.querySelector('img');
            if (img && img.dataset.src && !img.src) {
              img.src = img.dataset.src;
            }
          }
        });
      }, { 
        threshold: 0.1,
        rootMargin: '50px'
      });
      
      // مراقبة العناصر التي تحتاج تحسين
      const elementsToObserve = document.querySelectorAll(`
        .gallery__item,
        .services__item,
        .works-stack__inner,
        .animate-on-scroll
      `);
      
      elementsToObserve.forEach(el => {
        observer.observe(el);
      });
    } catch (error) {
      console.log('Intersection Observer error:', error);
    }
  }
  
  /**
   * تحسين الخطوط
   */
  optimizeFonts() {
    try {
      // إضافة preload للخطوط المهمة
      if (document.querySelector('link[href*="Boharat-Zataar"]')) {
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'fonts/Boharat-Zataar_Regular.otf';
        fontLink.as = 'font';
        fontLink.type = 'font/otf';
        fontLink.crossOrigin = 'anonymous';
        document.head.appendChild(fontLink);
      }
    } catch (error) {
      console.log('Font optimization error:', error);
    }
  }
  
  /**
   * تنظيف الذاكرة
   */
  cleanup() {
    try {
      // تنظيف will-change بعد الانتهاء من الحركة
      setTimeout(() => {
        const elementsWithWillChange = document.querySelectorAll('[style*="will-change"]');
        elementsWithWillChange.forEach(el => {
          if (el.style.willChange === 'transform') {
            el.style.willChange = 'auto';
          }
        });
      }, 1000);
    } catch (error) {
      console.log('Cleanup error:', error);
    }
  }
}

// تهيئة المحسن عند تحميل الصفحة
let performanceOptimizer = null;

document.addEventListener('DOMContentLoaded', () => {
  try {
    performanceOptimizer = new PerformanceOptimizer();
    window.performanceOptimizer = performanceOptimizer;
  } catch (error) {
    console.log('Failed to initialize performance optimizer:', error);
  }
});

// تنظيف الذاكرة عند مغادرة الصفحة
window.addEventListener('beforeunload', () => {
  if (performanceOptimizer) {
    performanceOptimizer.cleanup();
  }
});

// تصدير الكلاس للاستخدام الخارجي
window.PerformanceOptimizer = PerformanceOptimizer;
