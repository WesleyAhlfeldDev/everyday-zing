</main><!-- #main -->

<footer class="site-footer" role="contentinfo">
	<div class="site-footer__inner">

		<div class="site-footer__brand">
			<a class="site-footer__logo" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
				<span class="site-footer__logo-name"><?php bloginfo( 'name' ); ?></span>
				<small class="site-footer__logo-sub"><?php bloginfo( 'description' ); ?></small>
			</a>
			<p class="site-footer__tagline"><?php esc_html_e( 'Real food, honest money, and adventures you can afford.', 'everyday-zing-theme' ); ?></p>
		</div>

		<div class="site-footer__col">
			<p class="site-footer__col-label"><?php esc_html_e( 'Explore', 'everyday-zing-theme' ); ?></p>
			<?php
			wp_nav_menu( [
				'theme_location' => 'footer',
				'container'      => false,
				'menu_class'     => 'site-footer__links',
				'fallback_cb'    => false,
			] );
			?>
		</div>

		<div class="site-footer__col">
			<p class="site-footer__col-label"><?php esc_html_e( 'Connect', 'everyday-zing-theme' ); ?></p>
			<?php
			wp_nav_menu( [
				'theme_location' => 'social',
				'container'      => false,
				'menu_class'     => 'site-footer__links',
				'fallback_cb'    => false,
			] );
			?>
		</div>

	</div>

	<div class="site-footer__bottom">
		<span>&copy; <?php echo esc_html( date( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?></span>
		<span>
			<a href="<?php echo esc_url( get_privacy_policy_url() ); ?>"><?php esc_html_e( 'Privacy', 'everyday-zing-theme' ); ?></a>
			&middot;
			<a href="#"><?php esc_html_e( 'Terms', 'everyday-zing-theme' ); ?></a>
		</span>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
