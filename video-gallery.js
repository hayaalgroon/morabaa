/* Video Gallery Controller */
document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit to ensure all elements are loaded
  setTimeout(function() {
    const videoWrappers = document.querySelectorAll('.video-wrapper');
    const fullscreenOverlay = document.querySelector('.video-fullscreen-overlay');
    const fullscreenVideo = document.getElementById('fullscreen-video');
    const fullscreenClose = document.querySelector('.video-fullscreen-close');
    
    // Check if required elements exist
    if (!fullscreenOverlay || !fullscreenVideo || !fullscreenClose) {
      console.error('Required fullscreen elements not found');
      return;
    }
    
    console.log('Video gallery initialized with', videoWrappers.length, 'video wrappers');
    
    // تحسين الأداء: تخزين العناصر في متغيرات
    const videoElements = [];
    
    videoWrappers.forEach((wrapper, index) => {
      const video = wrapper.querySelector('.gallery__video');
      const overlay = wrapper.querySelector('.video-overlay');
      const fullscreenBtn = wrapper.querySelector('.video-fullscreen-btn');
      
      if (video) {
        // إضافة lazy loading للفيديوهات
        if (video.dataset.src) {
          video.src = video.dataset.src;
        }
        
        wrapper.classList.add('playing');
        
        video.muted = true;
        video.autoplay = true;
        video.loop = true;
        video.playsinline = true;
        video.preload = 'metadata'; // تحسين الأداء - تحميل البيانات الأساسية فقط
        
        // Additional Safari fixes
        if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
          video.setAttribute('webkit-playsinline', 'true');
          video.setAttribute('webkit-presentation-mode', 'inline');
        }
        
        // تحسين الأداء: إزالة مؤقتاً
        
        wrapper.addEventListener('click', function(e) {
          if (e.target.closest('.video-fullscreen-btn')) {
            return;
          }
          
          e.preventDefault();
          
          if (video.paused) {
            video.play().then(() => {
              wrapper.classList.add('playing');
            }).catch(error => {
              console.log('Gallery video play failed:', error);
            });
          } else {
            video.pause();
            video.currentTime = 0;
            wrapper.classList.remove('playing');
          }
        });
        
        if (fullscreenBtn) {
          fullscreenBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Fullscreen button clicked for video', index);
            
            const videoSource = video.querySelector('source');
            if (videoSource && videoSource.src) {
              fullscreenVideo.src = videoSource.src;
              fullscreenVideo.load();
              fullscreenVideo.muted = false;
              fullscreenVideo.controls = true;
              fullscreenOverlay.classList.add('active');
              
              fullscreenVideo.play().catch(error => {
                console.log('Fullscreen video play failed:', error);
              });
            } else {
              console.error('Video source not found');
            }
          });
        }
        
        video.addEventListener('ended', function() {
          // Don't remove playing class for loop
        });
        
        video.addEventListener('pause', function() {
          if (video.currentTime === 0) {
            wrapper.classList.remove('playing');
          }
        });
        
        video.addEventListener('play', function() {
          wrapper.classList.add('playing');
        });
        
        // تخزين العناصر للاستخدام اللاحق
        videoElements.push({ wrapper, video, overlay, fullscreenBtn });
      }
    });
    
    // إضافة Intersection Observer لتحسين الأداء
    if ('IntersectionObserver' in window) {
      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const video = entry.target;
            // تحميل الفيديو عند ظهوره
            if (video.dataset.src && !video.src) {
              video.src = video.dataset.src;
              video.load();
            }
          }
        });
      }, { 
        threshold: 0.1,
        rootMargin: '50px'
      });
      
      videoElements.forEach(({ video }) => {
        videoObserver.observe(video);
      });
    }
    
    if (fullscreenClose) {
      fullscreenClose.addEventListener('click', function() {
        console.log('Closing fullscreen video');
        fullscreenOverlay.classList.remove('active');
        fullscreenVideo.pause();
        fullscreenVideo.currentTime = 0;
        fullscreenVideo.muted = true;
        fullscreenVideo.controls = false;
      });
    }
    
    if (fullscreenOverlay) {
      fullscreenOverlay.addEventListener('click', function(e) {
        if (e.target === fullscreenOverlay) {
          console.log('Closing fullscreen video by clicking overlay');
          fullscreenOverlay.classList.remove('active');
          fullscreenVideo.pause();
          fullscreenVideo.currentTime = 0;
          fullscreenVideo.muted = true;
          fullscreenVideo.controls = false;
        }
      });
      
      // إضافة دعم لوحة المفاتيح للفيديو المكبر
      document.addEventListener('keydown', function(e) {
        // فقط عندما يكون الفيديو مكبر
        if (fullscreenOverlay.classList.contains('active')) {
          switch(e.key) {
            case 'Escape':
            case 'Esc':
              e.preventDefault();
              console.log('Closing fullscreen video with ESC key');
              fullscreenOverlay.classList.remove('active');
              fullscreenVideo.pause();
              fullscreenVideo.currentTime = 0;
              fullscreenVideo.muted = true;
              fullscreenVideo.controls = false;
              break;
              
            case ' ':
            case 'Spacebar':
              e.preventDefault();
              if (fullscreenVideo.paused) {
                console.log('Playing fullscreen video with Space key');
                fullscreenVideo.play().catch(error => {
                  console.log('Fullscreen video play failed:', error);
                });
              } else {
                console.log('Pausing fullscreen video with Space key');
                fullscreenVideo.pause();
              }
              break;
              
            case 'ArrowLeft':
              e.preventDefault();
              fullscreenVideo.currentTime = Math.max(0, fullscreenVideo.currentTime - 10);
              break;
              
            case 'ArrowRight':
              e.preventDefault();
              fullscreenVideo.currentTime = Math.min(fullscreenVideo.duration, fullscreenVideo.currentTime + 10);
              break;
              
            case 'ArrowUp':
              e.preventDefault();
              fullscreenVideo.volume = Math.min(1, fullscreenVideo.volume + 0.1);
              break;
              
            case 'ArrowDown':
              e.preventDefault();
              fullscreenVideo.volume = Math.max(0, fullscreenVideo.volume - 0.1);
              break;
              
            case 'm':
            case 'M':
              e.preventDefault();
              fullscreenVideo.muted = !fullscreenVideo.muted;
              break;
              
            case 'f':
            case 'F':
              e.preventDefault();
              if (fullscreenVideo.requestFullscreen) {
                fullscreenVideo.requestFullscreen();
              } else if (fullscreenVideo.webkitRequestFullscreen) {
                fullscreenVideo.webkitRequestFullscreen();
              } else if (fullscreenVideo.msRequestFullscreen) {
                fullscreenVideo.msRequestFullscreen();
              }
              break;
          }
        }
      });
    }
    
    /* Main Video Controller */
    const mainVideoDivider = document.querySelector('.divider-video');
    if (mainVideoDivider) {
      const mainVideo = mainVideoDivider.querySelector('.main-video');
      const mainOverlay = mainVideoDivider.querySelector('.video-overlay');
      const mainFullscreenBtn = mainVideoDivider.querySelector('.video-fullscreen-btn');
      
      if (mainVideo) {
        mainVideoDivider.classList.add('playing');
        
        mainVideo.muted = true;
        mainVideo.autoplay = true;
        mainVideo.loop = true;
        mainVideo.playsinline = true;
        mainVideo.preload = 'metadata'; // تحسين الأداء - تحميل البيانات الأساسية فقط
        
        // Additional Safari fixes for main video
        if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
          mainVideo.setAttribute('webkit-playsinline', 'true');
          mainVideo.setAttribute('webkit-presentation-mode', 'inline');
        }
        
        // تحسين الأداء: إزالة مؤقتاً
        
        mainVideoDivider.addEventListener('click', function(e) {
          if (e.target.closest('.video-fullscreen-btn')) {
            return;
          }
          
          e.preventDefault();
          
          if (mainVideo.paused) {
            mainVideo.play().then(() => {
              mainVideoDivider.classList.add('playing');
            }).catch(error => {
              console.log('Main video play failed:', error);
            });
          } else {
            mainVideo.pause();
            mainVideo.currentTime = 0;
            mainVideoDivider.classList.remove('playing');
          }
        });
        
        if (mainFullscreenBtn) {
          mainFullscreenBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Main video fullscreen button clicked');
            
            const videoSource = mainVideo.querySelector('source');
            if (videoSource && videoSource.src) {
              fullscreenVideo.src = videoSource.src;
              fullscreenVideo.load();
              fullscreenVideo.muted = false;
              fullscreenVideo.controls = true;
              fullscreenOverlay.classList.add('active');
              
              fullscreenVideo.play().catch(error => {
                console.log('Fullscreen video play failed:', error);
            });
            } else {
              console.error('Main video source not found');
            }
          });
        }
        
        mainVideo.addEventListener('ended', function() {
          // Don't remove playing class for loop
        });
        
        mainVideo.addEventListener('pause', function() {
          if (mainVideo.currentTime === 0) {
            mainVideoDivider.classList.remove('playing');
          }
        });
        
        mainVideo.addEventListener('play', function() {
          mainVideoDivider.classList.add('playing');
        });
      }
    }
  }, 2000); // زيادة التأخير إلى ثانيتين
});
