/**
 * نظام تحميل ذكي للفيديوهات
 * يحمل الفيديوهات الكبيرة بعد ثانيتين من تحميل الموقع
 */

class SmartVideoLoader {
  constructor() {
    this.videos = [];
    this.isInitialized = false;
    this.init();
  }
  
  init() {
    // انتظار تحميل الصفحة
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupVideoLoading());
    } else {
      this.setupVideoLoading();
    }
  }
  
  setupVideoLoading() {
    // البحث عن جميع الفيديوهات
    this.findVideos();
    
    // بدء تحميل الفيديوهات بعد ثانيتين
    setTimeout(() => {
      this.startLoadingVideos();
    }, 2000);
    
    // إضافة مراقب للفيديوهات المرئية
    this.setupIntersectionObserver();
    
    // إضافة مراقب لتحميل الصفحة
    this.setupPageLoadObserver();
  }
  
  setupPageLoadObserver() {
    // مراقبة تحميل الصفحة
    if (document.readyState === 'complete') {
      this.onPageFullyLoaded();
    } else {
      window.addEventListener('load', () => this.onPageFullyLoaded());
    }
  }
  
  onPageFullyLoaded() {
    // تحميل الفيديوهات التي لم يتم تحميلها بعد
    this.videos.forEach(videoData => {
      if (!videoData.isLoaded) {
        this.loadVideo(videoData.element);
        videoData.isLoaded = true;
      }
    });
  }
  
  findVideos() {
    const videoElements = document.querySelectorAll('video');
    videoElements.forEach(video => {
      // تحديد حجم الفيديو
      const videoSize = this.getVideoSize(video);
      
      this.videos.push({
        element: video,
        size: videoSize,
        isLoaded: false,
        isVisible: false
      });
    });
  }
  
  getVideoSize(video) {
    // محاولة الحصول على حجم الفيديو
    if (video.videoWidth && video.videoHeight) {
      return video.videoWidth * video.videoHeight;
    }
    
    // إذا لم يكن متاحاً، نستخدم حجم العنصر
    const rect = video.getBoundingClientRect();
    return rect.width * rect.height;
  }
  
  startLoadingVideos() {
    this.videos.forEach(videoData => {
      const { element } = videoData;
      
      // تحميل جميع الفيديوهات
      this.loadVideo(element);
      videoData.isLoaded = true;
    });
  }
  
  loadVideo(video) {
    // إذا كان الفيديو يحتوي على data-src، استخدمه
    if (video.dataset.src && !video.src) {
      video.src = video.dataset.src;
      video.load();
    }
    
    // تحسين preload للفيديوهات
    if (video.preload !== 'metadata') {
      video.preload = 'metadata';
    }
    
    // إضافة event listeners للفيديو
    this.addVideoEventListeners(video);
  }
  
  addVideoEventListeners(video) {
    // مراقبة تقدم التحميل
    video.addEventListener('progress', () => {
      // يمكن إضافة مؤشر تقدم هنا في المستقبل
    });
    
    // عند بدء التحميل
    video.addEventListener('loadstart', () => {
      // بدء التحميل
    });
    
    // عند اكتمال التحميل
    video.addEventListener('loadeddata', () => {
      // تم تحميل البيانات
    });
    
    // عند اكتمال التحميل الكامل
    video.addEventListener('canplaythrough', () => {
      // يمكن تشغيل الفيديو
    });
    
    // عند حدوث خطأ
    video.addEventListener('error', (e) => {
      // خطأ في التحميل
    });
  }
  
  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target;
          const videoData = this.videos.find(v => v.element === video);
          
          if (videoData && !videoData.isVisible) {
            videoData.isVisible = true;
            
            // تحميل الفيديو إذا لم يكن محملاً
            if (!videoData.isLoaded) {
              this.loadVideo(video);
              videoData.isLoaded = true;
            }
          }
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '100px'
    });
    
    // مراقبة جميع الفيديوهات
    this.videos.forEach(videoData => {
      observer.observe(videoData.element);
    });
  }
  
  // دالة لتحميل فيديو محدد
  loadSpecificVideo(videoSelector) {
    const video = document.querySelector(videoSelector);
    if (video) {
      this.loadVideo(video);
    }
  }
  
  // دالة لإيقاف تحميل فيديو
  stopVideoLoading(videoSelector) {
    const video = document.querySelector(videoSelector);
    if (video) {
      // يمكن إضافة منطق إيقاف التحميل هنا
    }
  }
}

// تهيئة النظام عند تحميل الصفحة
let smartVideoLoader = null;

document.addEventListener('DOMContentLoaded', () => {
  try {
    smartVideoLoader = new SmartVideoLoader();
    window.smartVideoLoader = smartVideoLoader;
  } catch (error) {
    // فشل في التهيئة
  }
});
