<div class="no-results" style="text-align: center; padding: var(--space-16) 0;">
	<h2><?php esc_html_e( 'Nothing here yet', 'everyday-zing-theme' ); ?></h2>
	<p style="color: var(--color-text-muted); margin-top: var(--space-4);">
		<?php
		if ( is_search() ) {
			esc_html_e( 'No results matched your search. Try different keywords.', 'everyday-zing-theme' );
		} else {
			esc_html_e( 'It looks like nothing was found at this location.', 'everyday-zing-theme' );
		}
		?>
	</p>
	<?php if ( is_search() ) get_search_form(); ?>
</div>
