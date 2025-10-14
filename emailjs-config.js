// EmailJS Configuration and Form Handling
(function() {
    'use strict';

    // التأكد من تحميل EmailJS
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS لم يتم تحميله!');
        return;
    }

    emailjs.init("zHFEC8VhnuTwhO3Yl"); 

    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');

    // التأكد من وجود العناصر
    if (!contactForm || !submitBtn) {
        console.error('بعض عناصر النموذج مفقودة!', {
            contactForm: !!contactForm,
            submitBtn: !!submitBtn
        });
        return;
    }

    // معالجة إرسال النموذج
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // التحقق من صحة النموذج
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }
        
        // تعطيل الزر وإظهار حالة التحميل
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-caption').textContent = 'جاري الإرسال...';

        const formData = {
            user_name: document.getElementById('user_name').value.trim(),
            user_company: document.getElementById('user_company').value.trim(),
            user_email: document.getElementById('user_email').value.trim(),
            user_phone: document.getElementById('user_phone').value.trim(),
            user_message: document.getElementById('user_message').value.trim()
        };

        // إرسال الرسالة عبر EmailJS
        const templateParams = {
            user_name: formData.user_name,
            user_email: formData.user_email,
            user_phone: formData.user_phone || 'غير محدد',
            user_company: formData.user_company || 'غير محدد',
            user_message: formData.user_message
        };

        // محاولة الإرسال مع القالب الصحيح
        emailjs.send('service_fl7fl18', 'template_h1q193a', templateParams)
        .then(function(response) {
            
            // نقل المستخدم إلى صفحة النجاح
            window.location.href = 'success.html';
            
        }, function(error) {
            console.error('EmailJS Error:', error);
            
            // محاولة مع قالب بديل
            return emailjs.send('service_fl7fl18', 'template_py3iex8', templateParams);
        })
        .then(function(response) {
            if (response) {
                // نقل المستخدم إلى صفحة النجاح
                window.location.href = 'success.html';
            }
        })
        .catch(function(finalError) {
            console.error('All EmailJS attempts failed:', finalError);
            
            // إظهار رسالة الخطأ للمستخدم
            alert('عذراً، حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى أو التواصل معنا عبر البريد الإلكتروني.');
        })
        .finally(function() {
            // إعادة تفعيل الزر
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-caption').textContent = 'وصلها لنا';
        });
    });

    // إضافة تأثير التحميل للزر
    submitBtn.addEventListener('click', function() {
        if (contactForm.checkValidity()) {
            this.classList.add('loading');
        }
    });

})();
