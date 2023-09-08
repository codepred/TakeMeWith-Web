
class Main {

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    scrollToTopInstant() {
        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });
    }

    scrollToHalf() {
        window.scrollTo({
            top: 700,
            behavior: 'smooth'
        });
    }

    scrollToElementById(elementId) {
        const targetElement = document.getElementById(elementId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'instant',
                block: 'center' 
            });
        }
    }

    scrollToElementByIdSmooth(elementId) {
        const targetElement = document.getElementById(elementId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center' 
            });
        }
    }

}



export default new Main();
