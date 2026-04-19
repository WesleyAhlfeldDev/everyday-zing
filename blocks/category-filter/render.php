<?php
/**
 * Category filter bar — links to category archives.
 * Automatically pulls published categories from WordPress.
 */

$categories = get_categories( [ 'hide_empty' => true, 'orderby' => 'name' ] );
$current    = get_queried_object();
$anchor     = ! empty( $block['anchor'] ) ? ' id="' . esc_attr( $block['anchor'] ) . '"' : '';
?>

<nav class="cat-filter"<?php echo $anchor; ?> aria-label="<?php esc_attr_e( 'Filter by category', 'everyday-zing-theme' ); ?>">

	<a href="<?php echo esc_url( home_url( '/blog' ) ); ?>"
		class="cat-filter__pill cat-filter__pill--all <?php echo ( ! is_category() ) ? 'is-active' : ''; ?>">
		<?php esc_html_e( 'All posts', 'everyday-zing-theme' ); ?>
	</a>

	<?php foreach ( $categories as $cat ) : ?>
		<a href="<?php echo esc_url( get_category_link( $cat->term_id ) ); ?>"
			class="cat-filter__pill cat-filter__pill--<?php echo esc_attr( $cat->slug ); ?> <?php echo ( is_category( $cat->term_id ) ) ? 'is-active' : ''; ?>">
			<?php echo esc_html( $cat->name ); ?>
		</a>
	<?php endforeach; ?>

</nav>
