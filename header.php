<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<a class="visually-hidden-focusable" href="#main"><?php esc_html_e( 'Skip to content', 'everyday-zing-theme' ); ?></a>

<header class="site-header" role="banner">
	<div class="container">
		<nav class="navbar navbar-expand-lg" aria-label="<?php esc_attr_e( 'Primary', 'everyday-zing-theme' ); ?>">

			<a class="navbar-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
				<?php
				if ( has_custom_logo() ) {
					the_custom_logo();
				} else {
					echo esc_html( get_bloginfo( 'name' ) );
				}
				?>
			</a>

			<button class="navbar-toggler" type="button"
				data-bs-toggle="offcanvas"
				data-bs-target="#mobileNav"
				aria-controls="mobileNav"
				aria-label="<?php esc_attr_e( 'Toggle navigation', 'everyday-zing-theme' ); ?>">
				<span class="navbar-toggler-icon"></span>
			</button>

			<div class="collapse navbar-collapse justify-content-end" id="primaryNav">
				<?php
				wp_nav_menu( [
					'theme_location' => 'primary',
					'container'      => false,
					'menu_class'     => 'navbar-nav',
					'fallback_cb'    => false,
					'walker'         => new \Walker_Nav_Menu(),
					'add_li_class'   => 'nav-item',
					'link_class'     => 'nav-link',
					'items_wrap'     => '<ul id="%1$s" class="%2$s">%3$s</ul>',
				] );
				?>
			</div>

		</nav>
	</div>
</header>

<!-- Mobile offcanvas nav -->
<div class="offcanvas offcanvas-end" tabindex="-1" id="mobileNav" aria-labelledby="mobileNavLabel">
	<div class="offcanvas-header">
		<h5 class="offcanvas-title" id="mobileNavLabel"><?php bloginfo( 'name' ); ?></h5>
		<button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="<?php esc_attr_e( 'Close', 'everyday-zing-theme' ); ?>"></button>
	</div>
	<div class="offcanvas-body">
		<?php
		wp_nav_menu( [
			'theme_location' => 'primary',
			'container'      => false,
			'menu_class'     => 'navbar-nav flex-column',
			'fallback_cb'    => false,
		] );
		?>
	</div>
</div>

<main id="main" class="site-main" role="main">
