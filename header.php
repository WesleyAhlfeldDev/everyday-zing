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
	<div class="site-header__inner">

		<?php if ( has_custom_logo() ) : ?>
			<div class="site-header__brand">
				<?php the_custom_logo(); ?>
			</div>
		<?php else : ?>
			<a class="site-header__brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
				<span class="site-header__logo-name"><?php bloginfo( 'name' ); ?></span>
				<small class="site-header__logo-sub"><?php bloginfo( 'description' ); ?></small>
			</a>
		<?php endif; ?>

		<nav class="site-header__nav" id="site-nav" aria-label="<?php esc_attr_e( 'Primary', 'everyday-zing-theme' ); ?>">
			<?php
			wp_nav_menu( [
				'theme_location' => 'primary',
				'container'      => false,
				'menu_class'     => 'site-header__nav-list',
				'fallback_cb'    => false,
				'link_before'    => '',
				'link_after'     => '',
			] );
			?>
		</nav>

		<div class="site-header__actions">
			<a href="#newsletter" class="site-header__cta"><?php esc_html_e( 'Subscribe', 'everyday-zing-theme' ); ?></a>

			<button class="site-header__toggle" aria-controls="site-nav" aria-expanded="false" aria-label="<?php esc_attr_e( 'Toggle menu', 'everyday-zing-theme' ); ?>">
				<span class="site-header__toggle-bar"></span>
				<span class="site-header__toggle-bar"></span>
				<span class="site-header__toggle-bar"></span>
			</button>
		</div>

	</div>
</header>

<main id="main" class="site-main" role="main">
