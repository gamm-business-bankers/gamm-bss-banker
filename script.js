const partials = [
    { id: 'header-root', path: 'partials/header.html' },
    { id: 'servicos-root', path: 'partials/servicos.html' },
    { id: 'operacao-fgi-root', path: 'partials/operacao-fgi.html' },
    { id: 'caracteristicas-fgi-root', path: 'partials/caracteristicas-fgi.html' },
    { id: 'operacoes-imoveis-root', path: 'partials/operacoes-imoveis.html' },
    { id: 'sobre-root', path: 'partials/sobre.html' },
    { id: 'footer-root', path: 'partials/footer.html' },
    { id: 'modal-root', path: 'partials/modal.html' }
];

const loadPartial = async ({ id, path }) => {
    const container = document.getElementById(id);
    if (!container) return;

    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Erro ao carregar ${path}`);
        container.innerHTML = await response.text();
    } catch (error) {
        console.error(error);
    }
};

const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    
    if (digits.length === 0) return '';
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
};

const initModal = () => {
    const openModalButtons = document.querySelectorAll('[data-open-modal]');
    const closeModalButton = document.getElementById('close-modal');
    const infoModal = document.getElementById('info-modal');
    const phoneInput = document.getElementById('phone-input');
    const contactForm = document.getElementById('contact-form');

    if (!infoModal) return;

    openModalButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            infoModal.classList.remove('hidden');
            infoModal.classList.add('flex');
            document.body.classList.add('no-scroll');
            document.body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : '';
        });
    });

    closeModalButton?.addEventListener('click', () => {
        infoModal.classList.add('hidden');
        infoModal.classList.remove('flex');
        document.body.classList.remove('no-scroll');
        document.body.style.paddingRight = '';
    });

    phoneInput?.addEventListener('input', (event) => {
        const input = event.target;
        const cursorPosition = input.selectionStart;
        const oldValue = input.value;
        const oldLength = oldValue.length;
        
        const formatted = formatPhone(oldValue);
        input.value = formatted;
        
        // Ajusta a posição do cursor
        const newLength = formatted.length;
        const diff = newLength - oldLength;
        
        if (diff > 0) {
            // Adicionou caracteres (formatação)
            input.setSelectionRange(cursorPosition + diff, cursorPosition + diff);
        } else {
            // Removeu ou manteve
            const newPosition = Math.max(0, cursorPosition);
            input.setSelectionRange(newPosition, newPosition);
        }
    });

    contactForm?.addEventListener('submit', async (event) => {
        event.preventDefault();

        const buttonText = document.getElementById('button-text');
        const buttonLoading = document.getElementById('button-loading');
        const formMessage = document.getElementById('form-message');
        const submitButton = contactForm.querySelector('button[type="submit"]');

        const phoneValue = phoneInput?.value || '';
        const phoneDigits = phoneValue.replace(/\D/g, '');
        
        if (phoneDigits.length < 8) {
            formMessage.textContent = 'Por favor, digite um telefone válido com DDD (mínimo 8 dígitos).';
            formMessage.className = 'text-sm text-center text-red-600';
            formMessage.classList.remove('hidden');
            return;
        }

        submitButton.disabled = true;
        buttonText.classList.add('hidden');
        buttonLoading.classList.remove('hidden');
        formMessage.classList.add('hidden');

        try {
            const formData = new FormData(contactForm);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                formMessage.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
                formMessage.className = 'text-sm text-center text-green-600';
                formMessage.classList.remove('hidden');
                contactForm.reset();
                
                setTimeout(() => {
                    infoModal.classList.add('hidden');
                    infoModal.classList.remove('flex');
                    document.body.classList.remove('no-scroll');
                    document.body.style.paddingRight = '';
                    formMessage.classList.add('hidden');
                }, 2000);
            } else {
                throw new Error(data.message || 'Erro ao enviar mensagem');
            }
        } catch (error) {
            formMessage.textContent = 'Erro ao enviar mensagem. Por favor, tente novamente.';
            formMessage.className = 'text-sm text-center text-red-600';
            formMessage.classList.remove('hidden');
            console.error('Erro no envio:', error);
        } finally {
            submitButton.disabled = false;
            buttonText.classList.remove('hidden');
            buttonLoading.classList.add('hidden');
        }
    });
};

const initMobileMenu = () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

    if (!mobileMenuBtn || !mobileMenu) return;

    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = !mobileMenu.classList.contains('hidden');
        
        if (isOpen) {
            mobileMenu.classList.add('hidden');
            mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars text-xl"></i>';
        } else {
            mobileMenu.classList.remove('hidden');
            mobileMenuBtn.innerHTML = '<i class="fa-solid fa-xmark text-xl"></i>';
        }
    });

    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars text-xl"></i>';
        });
    });
};

const initScrollAnimation = () => {
    const nav = document.querySelector('nav');
    if (!nav) return;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
};
const initSmoothScroll = () => {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href === '#') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const navHeight = 73;
                const offset = 10;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight - offset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                const mobileMenu = document.getElementById('mobile-menu');
                const mobileMenuBtn = document.getElementById('mobile-menu-btn');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars text-xl"></i>';
                }
            }
        });
    });
};
const init = async () => {
    await Promise.all(partials.map(loadPartial));
    initModal();
    initMobileMenu();
    initScrollAnimation();
    initSmoothScroll();
};

init();
