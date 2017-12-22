/******************************\
< * Smooth scroll to anchors * >
\******************************/

class Anchor {
    constructor(link, options = null) {
        this.state = {
            prevPosition: 0,    // will be updated on click
            scrollTo: 0,        // will be updated on click
            speed: 150,         // px per animation frame
        };

        this.animateScroll = this.animateScroll.bind(this);

        this.onClick(link);
    }

    /**
     * Adds event listener to anchor trigger (link)
     * @param {node} link 
     */
    onClick(link) {
        link.addEventListener('click', e => {
            e.stopPropagation();
            // update state and scroll
            this.updateState(link).animateScroll(e);
        });
    }

    /**
     * Calculate params for scrolling
     * @param {node} link 
     */
    updateState(link) {
        // first check for target to exist
        if (!document.getElementById(link.hash.split('#')[1])) return this;

        // prepare params
        let anchor = document.getElementById(link.hash.split('#')[1]),
            anchorOffset = anchor.getBoundingClientRect().top,
            adjustment = anchor.getAttribute('data-offset') ? Number(anchor.getAttribute('data-offset')) : 0,
            total = anchorOffset + window.pageYOffset - adjustment;

        // update local state with params
        this.state = {
            prevPosition: window.pageYOffset,
            scrollTo: total,
            speed: window.pageYOffset > total ? -this.state.speed : this.state.speed // define scroll direction
        }

        return this;
    }

    /**
     * Normal scroll (1 & 2 stage)
     * - update local state
     * - do scroll
     * - callback 'animateScroll'
     */
    doScroll() {
        this.state.prevPosition += this.state.speed;
        window.scrollTo(0, this.state.prevPosition);
        requestAnimationFrame(this.animateScroll);
    }

    /**
     * Decrease scrolling speed, aka EASE function
     * if speed is greater than distance to the link
     * then check if its even less than 15
     * if so => greatly slow down not to jump over the destination
     * else just start slowing down by half speed each frame
     * @param {number} delta distance to target
     */
    slowDown(delta) {
        return Math.abs(this.state.speed / 2) > delta ? this.state.speed / (delta < 15 ? 150 : delta) : this.state.speed / 2;
    }

    /**
     * Smooth scrolling 
     * @param {*} e event object
     */
    animateScroll(e = {}) {
        // check diff between current and previous position
        // if 3 times more than speed => stage 1 (full speed)
        // if less than 3 times speed => stage 2 (start slowing)
        // if less than 1 => stage 3 (finalize)
        let delta = Math.abs(this.state.scrollTo - this.state.prevPosition);

        // prevent browser default if there's nowhere to scroll
        if (delta < 1 && e.preventDefault) e.preventDefault();

        if (delta > Math.abs(this.state.speed * 3)) {
            // 1 stage
            this.doScroll();
        } else if (delta > 1) {
            // 2 stage
            this.state.speed = this.slowDown(delta);
            this.doScroll();
        } else {
            // 3 stage
            window.scrollTo(0, this.state.scrollTo);
            this.state.speed = 150; // reset speed when done
        }
    }
}

/****************\
< * INITIALIZE * >
\****************/
export default _ => {
    [...document.getElementsByClassName('anchor')].forEach(anchor => new Anchor(anchor));
}
