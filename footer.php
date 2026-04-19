</main><!-- #main -->

<footer class="site-footer" role="contentinfo">
	<div class="container">
		<div class="row g-4 mb-5">

			<div class="col-md-4">
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="d-inline-block mb-2">
					<strong><?php bloginfo( 'name' ); ?></strong>
				</a>
				<p class="text-muted small"><?php bloginfo( 'description' ); ?></p>
			</div>

			<div class="col-md-4">
				<?php if ( is_active_sidebar( 'footer-1' ) ) : ?>
					<?php dynamic_sidebar( 'footer-1' ); ?>
				<?php else : ?>
					<h3 class="site-footer__heading"><?php esc_html_e( 'Navigate', 'everyday-zing-theme' ); ?></h3>
					<?php
					wp_nav_menu( [
						'theme_location' => 'footer',
						'container'      => false,
						'menu_class'     => 'site-footer__nav list-unstyled',
						'fallback_cb'    => false,
					] );
					?>
				<?php endif; ?>
			</div>

			<div class="col-md-4">
			</div>

		</div>

		<div class="site-footer__bottom d-flex flex-wrap justify-content-between align-items-center">
			<span>&copy; <?php echo esc_html( date( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?>. <?php esc_html_e( 'All rights reserved.', 'everyday-zing-theme' ); ?></span>
			<span class="small"><?php printf( esc_html__( 'Powered by %s', 'everyday-zing-theme' ), '<a href="https://wordpress.org">WordPress</a>' ); ?></span>
		</div>

	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
