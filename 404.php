<?php get_header(); ?>

<div class="container">
	<div class="error-404">
		<div class="error-404__code">404</div>
		<h1><?php esc_html_e( 'Page not found', 'everyday-zing-theme' ); ?></h1>
		<p style="color: var(--color-text-muted); margin-top: var(--space-4); margin-bottom: var(--space-8);">
			<?php esc_html_e( "The page you're looking for doesn't exist or has been moved.", 'everyday-zing-theme' ); ?>
		</p>
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="btn btn--primary">
			<?php esc_html_e( 'Back to Home', 'everyday-zing-theme' ); ?>
		</a>
	</div>
</div>

<?php get_footer(); ?>
