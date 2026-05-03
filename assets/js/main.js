// Theme SCSS entry — webpack extracts this to assets/dist/main.css
import '../scss/main.scss';

// Bootstrap JS components
import { Collapse, Offcanvas } from 'bootstrap';

document.addEventListener( 'DOMContentLoaded', () => {

	// Mobile nav toggle
	const toggle = document.querySelector( '.site-header__toggle' );
	const nav    = document.getElementById( 'site-nav' );

	if ( toggle && nav ) {
		toggle.addEventListener( 'click', () => {
			const isOpen = nav.classList.toggle( 'is-open' );
			toggle.setAttribute( 'aria-expanded', String( isOpen ) );
		} );

		document.addEventListener( 'click', ( e ) => {
			if ( nav.classList.contains( 'is-open' ) && ! nav.contains( e.target ) && ! toggle.contains( e.target ) ) {
				nav.classList.remove( 'is-open' );
				toggle.setAttribute( 'aria-expanded', 'false' );
			}
		} );
	}

	// Mobile submenu toggles
	document.querySelectorAll( '.site-header__nav .menu-item-has-children > a' ).forEach( ( link ) => {
		link.addEventListener( 'click', ( e ) => {
			if ( window.innerWidth <= 768 ) {
				e.preventDefault();
				link.closest( 'li' ).classList.toggle( 'is-open' );
			}
		} );
	} );

	// Instagram carousel dot indicators
	const track = document.getElementById( 'ig-track' );
	const dots  = document.querySelectorAll( '.ig-block__dot' );

	if ( track && dots.length ) {
		const cardWidth = 138; // card width + gap

		track.addEventListener( 'scroll', () => {
			const index = Math.round( track.scrollLeft / cardWidth );
			dots.forEach( ( dot, i ) => dot.classList.toggle( 'is-active', i === index ) );
		} );

		dots.forEach( ( dot, i ) => {
			dot.addEventListener( 'click', () => {
				track.scrollTo( { left: i * cardWidth, behavior: 'smooth' } );
			} );
		} );
	}

} );
