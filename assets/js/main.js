// Theme SCSS entry — webpack extracts this to assets/dist/main.css
import '../scss/main.scss';

// Bootstrap JS (only what's needed)
import { Collapse, Offcanvas } from 'bootstrap';

// Mobile nav
document.addEventListener( 'DOMContentLoaded', () => {
	const toggles = document.querySelectorAll( '[data-bs-toggle="offcanvas"]' );
	toggles.forEach( ( el ) => new Offcanvas( el ) );
} );
