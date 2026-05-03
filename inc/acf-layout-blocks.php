<?php
defined( 'ABSPATH' ) || exit;

add_action( 'acf/init', 'as_register_acf_blocks' );
add_action( 'acf/init', 'as_register_layout_block_fields' );

function as_register_acf_blocks(): void {
	if ( ! function_exists( 'acf_register_block_type' ) ) {
		return;
	}

	acf_register_block_type( [
		'name'            => 'buttons',
		'title'           => __( 'Buttons', 'everyday-zing-theme' ),
		'description'     => __( 'Reusable button group.', 'everyday-zing-theme' ),
		'render_template' => get_template_directory() . '/blocks/buttons/render.php',
		'category'        => 'ahlfeld-solutions',
		'icon'            => 'button',
		'keywords'        => [ 'buttons', 'cta', 'links', 'actions' ],
		'mode'            => 'edit',
		'supports'        => [
			'anchor' => true,
			'align'  => [ 'left', 'center', 'right' ],
		],
	] );
}

function as_register_layout_block_fields(): void {
	if ( ! function_exists( 'acf_add_local_field_group' ) ) {
		return;
	}

	// ─────────────────────────────────────────────
	// Helpers
	// ─────────────────────────────────────────────

	$none = [ '' => '— None —' ];

	$container_choices = [
		''                => '— No container —',
		'container'       => 'Container',
		'container-fluid' => 'Container Fluid',
		'container-sm'    => 'Container SM',
		'container-md'    => 'Container MD',
		'container-lg'    => 'Container LG',
		'container-xl'    => 'Container XL',
		'container-xxl'   => 'Container XXL',
	];

	$padding_y_choices = $none + [
		'py-0' => 'PY-0  (0)',
		'py-1' => 'PY-1  (0.25 rem)',
		'py-2' => 'PY-2  (0.5 rem)',
		'py-3' => 'PY-3  (1 rem)',
		'py-4' => 'PY-4  (1.5 rem)',
		'py-5' => 'PY-5  (3 rem)',
	];

	$padding_x_choices = $none + [
		'px-0' => 'PX-0  (0)',
		'px-1' => 'PX-1  (0.25 rem)',
		'px-2' => 'PX-2  (0.5 rem)',
		'px-3' => 'PX-3  (1 rem)',
		'px-4' => 'PX-4  (1.5 rem)',
		'px-5' => 'PX-5  (3 rem)',
	];

	$margin_y_choices = $none + [
		'my-0' => 'MY-0  (0)',
		'my-1' => 'MY-1  (0.25 rem)',
		'my-2' => 'MY-2  (0.5 rem)',
		'my-3' => 'MY-3  (1 rem)',
		'my-4' => 'MY-4  (1.5 rem)',
		'my-5' => 'MY-5  (3 rem)',
	];

	$bg_choices = $none + [
		'bg-white'            => 'White',
		'bg-light'            => 'Light (Soft White)',
		'bg-dark'             => 'Dark (Rich Black)',
		'bg-primary'          => 'Primary — Joy Pink',
		'bg-secondary'        => 'Secondary — Rich Black',
		'bg-success'          => 'Success — Money Teal',
		'bg-info'             => 'Info — Bold Purple',
		'bg-warning'          => 'Warning — Zing Lime',
		'bg-danger'           => 'Danger — Warm Coral',
		'bg-zing-lime'        => 'Zing Lime',
		'bg-joy-pink'         => 'Joy Pink',
		'bg-bold-purple'      => 'Bold Purple',
		'bg-warm-coral'       => 'Warm Coral',
		'bg-money-teal'       => 'Money Teal',
		'bg-warm-cream'       => 'Warm Cream',
		'bg-burgundy-script'  => 'Burgundy Script',
	];

	$text_color_choices = $none + [
		'text-white'  => 'White',
		'text-dark'   => 'Dark',
		'text-muted'  => 'Muted',
		'text-primary' => 'Primary',
	];

	$justify_choices = [ '' => '— Default —' ] + [
		'justify-content-start'   => 'Start',
		'justify-content-center'  => 'Center',
		'justify-content-end'     => 'End',
		'justify-content-between' => 'Space Between',
		'justify-content-around'  => 'Space Around',
		'justify-content-evenly'  => 'Space Evenly',
	];

	$align_items_choices = [ '' => '— Default —' ] + [
		'align-items-start'    => 'Start',
		'align-items-center'   => 'Center',
		'align-items-end'      => 'End',
		'align-items-stretch'  => 'Stretch',
		'align-items-baseline' => 'Baseline',
	];

	$gutter_choices = [ '' => '— Default —' ] + [
		'g-0' => 'G-0  (no gutter)',
		'g-1' => 'G-1  (0.25 rem)',
		'g-2' => 'G-2  (0.5 rem)',
		'g-3' => 'G-3  (1 rem)',
		'g-4' => 'G-4  (1.5 rem)',
		'g-5' => 'G-5  (3 rem)',
	];

	$gutter_x_choices = [ '' => '— Default —' ] + [
		'gx-0' => 'GX-0', 'gx-1' => 'GX-1', 'gx-2' => 'GX-2',
		'gx-3' => 'GX-3', 'gx-4' => 'GX-4', 'gx-5' => 'GX-5',
	];

	$gutter_y_choices = [ '' => '— Default —' ] + [
		'gy-0' => 'GY-0', 'gy-1' => 'GY-1', 'gy-2' => 'GY-2',
		'gy-3' => 'GY-3', 'gy-4' => 'GY-4', 'gy-5' => 'GY-5',
	];

	$row_cols_choices = [ '' => '— Default —' ] + [
		'row-cols-1' => '1 per row',
		'row-cols-2' => '2 per row',
		'row-cols-3' => '3 per row',
		'row-cols-4' => '4 per row',
		'row-cols-5' => '5 per row',
		'row-cols-6' => '6 per row',
	];

	$col_xs_choices = [ '' => '— None —' ] + [
		'col'     => 'col  (equal width)',
		'col-auto' => 'col-auto',
	] + array_combine(
		array_map( fn( $n ) => "col-$n", range( 1, 12 ) ),
		array_map( fn( $n ) => "$n / 12", range( 1, 12 ) )
	);

	$align_self_choices = [ '' => '— Default —' ] + [
		'align-self-start'    => 'Start',
		'align-self-center'   => 'Center',
		'align-self-end'      => 'End',
		'align-self-stretch'  => 'Stretch',
		'align-self-baseline' => 'Baseline',
	];

	// Helper: generate col-{bp}-* choices
	$col_bp = function ( string $bp ) use ( $none ): array {
		return $none + [
			"col-$bp"      => "col-$bp  (equal width)",
			"col-$bp-auto" => "col-$bp-auto",
		] + array_combine(
			array_map( fn( $n ) => "col-$bp-$n", range( 1, 12 ) ),
			array_map( fn( $n ) => "$n / 12", range( 1, 12 ) )
		);
	};

	// Helper: generate offset-{bp}-* choices
	$offset_bp = function ( string $bp ) use ( $none ): array {
		return $none + array_combine(
			array_map( fn( $n ) => "offset-$bp-$n", range( 1, 11 ) ),
			array_map( fn( $n ) => "$n columns", range( 1, 11 ) )
		);
	};

	// ─────────────────────────────────────────────
	// SECTION block fields
	// ─────────────────────────────────────────────
	acf_add_local_field_group( [
		'key'      => 'group_as_section',
		'title'    => 'Section Settings',
		'location' => [ [ [ 'param' => 'block', 'operator' => '==', 'value' => 'ahlfeld-solutions/section' ] ] ],
		'fields'   => [

			// Tab: Layout
			[ 'key' => 'field_as_sec_tab_layout', 'label' => 'Layout', 'type' => 'tab', 'placement' => 'top' ],

			[
				'key'           => 'field_as_sec_tag',
				'label'         => 'HTML Tag',
				'name'          => 'section_tag',
				'type'          => 'select',
				'default_value' => 'section',
				'choices'       => [
					'section' => 'section',
					'div'     => 'div',
					'article' => 'article',
					'aside'   => 'aside',
					'header'  => 'header',
					'footer'  => 'footer',
					'main'    => 'main',
				],
			],
			[
				'key'           => 'field_as_sec_container',
				'label'         => 'Container',
				'name'          => 'section_container',
				'type'          => 'select',
				'default_value' => 'container',
				'choices'       => $container_choices,
			],

			// Tab: Spacing
			[ 'key' => 'field_as_sec_tab_spacing', 'label' => 'Spacing', 'type' => 'tab', 'placement' => 'top' ],

			[
				'key'           => 'field_as_sec_use_custom_spacing',
				'label'         => 'Custom spacing?',
				'name'          => 'section_use_custom_spacing',
				'type'          => 'true_false',
				'default_value' => 0,
				'ui'            => 1,
			],

			[
				'key'               => 'field_as_sec_py',
				'label'             => 'Padding Y (top & bottom)',
				'name'              => 'section_padding_y',
				'type'              => 'select',
				'choices'           => $padding_y_choices,
				'conditional_logic' => [ [ [ 'field' => 'field_as_sec_use_custom_spacing', 'operator' => '==', 'value' => '0' ] ] ],
			],
			[
				'key'               => 'field_as_sec_px',
				'label'             => 'Padding X (left & right)',
				'name'              => 'section_padding_x',
				'type'              => 'select',
				'choices'           => $padding_x_choices,
				'conditional_logic' => [ [ [ 'field' => 'field_as_sec_use_custom_spacing', 'operator' => '==', 'value' => '0' ] ] ],
			],
			[
				'key'               => 'field_as_sec_my',
				'label'             => 'Margin Y (top & bottom)',
				'name'              => 'section_margin_y',
				'type'              => 'select',
				'choices'           => $margin_y_choices,
				'conditional_logic' => [ [ [ 'field' => 'field_as_sec_use_custom_spacing', 'operator' => '==', 'value' => '0' ] ] ],
			],

			[
				'key'               => 'field_as_sec_cpt',
				'label'             => 'Padding Top',
				'name'              => 'section_custom_padding_top',
				'type'              => 'text',
				'placeholder'       => 'e.g. 80px',
				'wrapper'           => [ 'width' => '50' ],
				'conditional_logic' => [ [ [ 'field' => 'field_as_sec_use_custom_spacing', 'operator' => '==', 'value' => '1' ] ] ],
			],
			[
				'key'               => 'field_as_sec_cpb',
				'label'             => 'Padding Bottom',
				'name'              => 'section_custom_padding_bottom',
				'type'              => 'text',
				'placeholder'       => 'e.g. 80px',
				'wrapper'           => [ 'width' => '50' ],
				'conditional_logic' => [ [ [ 'field' => 'field_as_sec_use_custom_spacing', 'operator' => '==', 'value' => '1' ] ] ],
			],
			[
				'key'               => 'field_as_sec_cpl',
				'label'             => 'Padding Left',
				'name'              => 'section_custom_padding_left',
				'type'              => 'text',
				'placeholder'       => 'e.g. 2rem',
				'wrapper'           => [ 'width' => '50' ],
				'conditional_logic' => [ [ [ 'field' => 'field_as_sec_use_custom_spacing', 'operator' => '==', 'value' => '1' ] ] ],
			],
			[
				'key'               => 'field_as_sec_cpr',
				'label'             => 'Padding Right',
				'name'              => 'section_custom_padding_right',
				'type'              => 'text',
				'placeholder'       => 'e.g. 2rem',
				'wrapper'           => [ 'width' => '50' ],
				'conditional_logic' => [ [ [ 'field' => 'field_as_sec_use_custom_spacing', 'operator' => '==', 'value' => '1' ] ] ],
			],
			[
				'key'               => 'field_as_sec_cmt',
				'label'             => 'Margin Top',
				'name'              => 'section_custom_margin_top',
				'type'              => 'text',
				'placeholder'       => 'e.g. 40px',
				'wrapper'           => [ 'width' => '50' ],
				'conditional_logic' => [ [ [ 'field' => 'field_as_sec_use_custom_spacing', 'operator' => '==', 'value' => '1' ] ] ],
			],
			[
				'key'               => 'field_as_sec_cmb',
				'label'             => 'Margin Bottom',
				'name'              => 'section_custom_margin_bottom',
				'type'              => 'text',
				'placeholder'       => 'e.g. 40px',
				'wrapper'           => [ 'width' => '50' ],
				'conditional_logic' => [ [ [ 'field' => 'field_as_sec_use_custom_spacing', 'operator' => '==', 'value' => '1' ] ] ],
			],

			// Tab: Style
			[ 'key' => 'field_as_sec_tab_style', 'label' => 'Style', 'type' => 'tab', 'placement' => 'top' ],

			[
				'key'     => 'field_as_sec_bg',
				'label'   => 'Background',
				'name'    => 'section_bg',
				'type'    => 'select',
				'choices' => $bg_choices,
			],
			[
				'key'     => 'field_as_sec_text',
				'label'   => 'Text Color',
				'name'    => 'section_text_color',
				'type'    => 'select',
				'choices' => $text_color_choices,
			],

			// Tab: Advanced
			[ 'key' => 'field_as_sec_tab_adv', 'label' => 'Advanced', 'type' => 'tab', 'placement' => 'top' ],

			[
				'key'         => 'field_as_sec_classes',
				'label'       => 'Extra Classes',
				'name'        => 'section_extra_classes',
				'type'        => 'text',
				'placeholder' => 'e.g. position-relative overflow-hidden',
			],
		],
	] );

	// ─────────────────────────────────────────────
	// ROW block fields
	// ─────────────────────────────────────────────
	acf_add_local_field_group( [
		'key'      => 'group_as_row',
		'title'    => 'Row Settings',
		'location' => [ [ [ 'param' => 'block', 'operator' => '==', 'value' => 'ahlfeld-solutions/row' ] ] ],
		'fields'   => [

			// Tab: Alignment
			[ 'key' => 'field_as_row_tab_align', 'label' => 'Alignment', 'type' => 'tab', 'placement' => 'top' ],

			[
				'key'     => 'field_as_row_justify',
				'label'   => 'Justify Content',
				'name'    => 'row_justify',
				'type'    => 'select',
				'choices' => $justify_choices,
			],
			[
				'key'     => 'field_as_row_align',
				'label'   => 'Align Items',
				'name'    => 'row_align_items',
				'type'    => 'select',
				'choices' => $align_items_choices,
			],

			// Tab: Gutters
			[ 'key' => 'field_as_row_tab_gutters', 'label' => 'Gutters', 'type' => 'tab', 'placement' => 'top' ],

			[
				'key'           => 'field_as_row_g',
				'label'         => 'Gutter (both axes)',
				'name'          => 'row_gutter',
				'type'          => 'select',
				'choices'       => $gutter_choices,
				'instructions'  => 'Overrides GX and GY when set.',
			],
			[
				'key'     => 'field_as_row_gx',
				'label'   => 'Gutter X (horizontal)',
				'name'    => 'row_gutter_x',
				'type'    => 'select',
				'choices' => $gutter_x_choices,
			],
			[
				'key'     => 'field_as_row_gy',
				'label'   => 'Gutter Y (vertical)',
				'name'    => 'row_gutter_y',
				'type'    => 'select',
				'choices' => $gutter_y_choices,
			],

			// Tab: Row Columns
			[ 'key' => 'field_as_row_tab_cols', 'label' => 'Row Columns', 'type' => 'tab', 'placement' => 'top' ],

			[
				'key'          => 'field_as_row_cols',
				'label'        => 'Columns (all screens)',
				'name'         => 'row_cols',
				'type'         => 'select',
				'choices'      => $row_cols_choices,
				'instructions' => 'Sets equal-width columns without using Column blocks.',
			],
			[
				'key'     => 'field_as_row_cols_sm',
				'label'   => 'Columns ≥ SM (576px)',
				'name'    => 'row_cols_sm',
				'type'    => 'select',
				'choices' => $none + array_combine(
					array_map( fn( $n ) => "row-cols-sm-$n", range( 1, 6 ) ),
					array_map( fn( $n ) => "$n per row", range( 1, 6 ) )
				),
			],
			[
				'key'     => 'field_as_row_cols_md',
				'label'   => 'Columns ≥ MD (768px)',
				'name'    => 'row_cols_md',
				'type'    => 'select',
				'choices' => $none + array_combine(
					array_map( fn( $n ) => "row-cols-md-$n", range( 1, 6 ) ),
					array_map( fn( $n ) => "$n per row", range( 1, 6 ) )
				),
			],
			[
				'key'     => 'field_as_row_cols_lg',
				'label'   => 'Columns ≥ LG (992px)',
				'name'    => 'row_cols_lg',
				'type'    => 'select',
				'choices' => $none + array_combine(
					array_map( fn( $n ) => "row-cols-lg-$n", range( 1, 6 ) ),
					array_map( fn( $n ) => "$n per row", range( 1, 6 ) )
				),
			],

			// Tab: Advanced
			[ 'key' => 'field_as_row_tab_adv', 'label' => 'Advanced', 'type' => 'tab', 'placement' => 'top' ],

			[
				'key'         => 'field_as_row_classes',
				'label'       => 'Extra Classes',
				'name'        => 'row_extra_classes',
				'type'        => 'text',
				'placeholder' => 'e.g. flex-nowrap',
			],
		],
	] );

	// ─────────────────────────────────────────────
	// BUTTONS block fields
	// ─────────────────────────────────────────────
	acf_add_local_field_group( [
		'key'      => 'group_as_buttons',
		'title'    => 'Buttons',
		'location' => [ [ [ 'param' => 'block', 'operator' => '==', 'value' => 'acf/buttons' ] ] ],
		'fields'   => [
			[
				'key'          => 'field_as_buttons',
				'label'        => 'Buttons',
				'name'         => 'buttons',
				'type'         => 'repeater',
				'collapsed'    => 'field_as_btn_link',
				'min'          => 0,
				'max'          => 0,
				'layout'       => 'block',
				'button_label' => 'Add Button',
				'sub_fields'   => [
					[
						'key'           => 'field_as_btn_link',
						'label'         => 'Link',
						'name'          => 'button_link',
						'type'          => 'link',
						'instructions'  => 'Sets the button label, URL, and whether it opens in a new tab.',
						'required'      => 1,
						'return_format' => 'array',
					],
					[
						'key'          => 'field_as_btn_style',
						'label'        => 'Style',
						'name'         => 'button_style',
						'type'         => 'select',
						'instructions' => 'Button shape and interaction style. Leave blank to use a standard Bootstrap button with a Color selected below.',
						'wrapper'      => [ 'width' => '50' ],
						'allow_null'   => 1,
						'ui'           => 1,
						'placeholder'  => '— Default Bootstrap button —',
						'choices'      => [
							'btn-lib-solid'           => 'Solid — Filled Primary',
							'btn-lib-pill'            => 'Pill — Rounded Solid',
							'btn-lib-ghost'           => 'Ghost — Outlined',
							'btn-lib-icon'            => 'Icon — Animated Arrow',
							'btn-lib-brutal'          => 'Brutalist — Hard Shadow',
							'btn-lib-gradient-pill'   => 'Gradient — Pill',
							'btn-lib-gradient-rounded'=> 'Gradient — Rounded',
							'btn-lib-editorial'       => 'Editorial — Serif Italic',
							'btn-lib-solid-secondary' => 'Solid — Dark (Secondary)',
							'btn-lib-text'            => 'Text — Underline Link',
							'btn-lib-glass'           => 'Glassmorphism',
							'btn-lib-accent-bar'      => 'Accent Bar',
							'btn-lib-outline-pill'    => 'Outline — Pill',
						],
					],
					[
						'key'          => 'field_as_btn_color',
						'label'        => 'Color',
						'name'         => 'button_color',
						'type'         => 'select',
						'instructions' => 'Brand color. Used as the full Bootstrap button color when no Style is set. Optional when a Style is selected.',
						'wrapper'      => [ 'width' => '50' ],
						'allow_null'   => 1,
						'ui'           => 1,
						'placeholder'  => '— Default (Joy Pink) —',
						'choices'      => [
							'btn-joy-pink'               => 'Joy Pink',
							'btn-bold-purple'            => 'Bold Purple',
							'btn-money-teal'             => 'Money Teal',
							'btn-warm-coral'             => 'Warm Coral',
							'btn-burgundy-script'        => 'Burgundy Script',
							'btn-zing-lime'              => 'Zing Lime',
							'btn-warm-cream'             => 'Warm Cream',
							'btn-outline-joy-pink'       => 'Outline — Joy Pink',
							'btn-outline-bold-purple'    => 'Outline — Bold Purple',
							'btn-outline-money-teal'     => 'Outline — Money Teal',
							'btn-outline-warm-coral'     => 'Outline — Warm Coral',
							'btn-outline-burgundy-script'=> 'Outline — Burgundy Script',
							'btn-outline-zing-lime'      => 'Outline — Zing Lime',
							'btn-outline-warm-cream'     => 'Outline — Warm Cream',
						],
					],
					[
						'key'          => 'field_as_btn_icon',
						'label'        => 'Icon',
						'name'         => 'button_icon',
						'type'         => 'select',
						'instructions' => 'Bootstrap Icon appended after the label.',
						'wrapper'      => [ 'width' => '50' ],
						'allow_null'   => 1,
						'ui'           => 1,
						'placeholder'  => '— None —',
						'choices'      => [
							'bi bi-arrow-right'        => 'Arrow Right →',
							'bi bi-arrow-left'         => 'Arrow Left ←',
							'bi bi-chevron-right'      => 'Chevron Right ›',
							'bi bi-chevron-left'       => 'Chevron Left ‹',
							'bi bi-download'           => 'Download ↓',
							'bi bi-box-arrow-up-right' => 'External Link ↗',
							'bi bi-plus-lg'            => 'Plus +',
							'bi bi-check-lg'           => 'Checkmark ✓',
							'bi bi-play-fill'          => 'Play ▶',
							'bi bi-star-fill'          => 'Star ★',
							'bi bi-heart-fill'         => 'Heart ♥',
							'bi bi-envelope'           => 'Email ✉',
							'bi bi-telephone'          => 'Phone ☎',
							'bi bi-cart'               => 'Cart',
							'bi bi-search'             => 'Search',
							'bi bi-share'              => 'Share',
						],
					],
					[
						'key'         => 'field_as_btn_custom_class',
						'label'       => 'Custom Class',
						'name'        => 'button_custom_class',
						'type'        => 'text',
						'instructions'=> 'Extra classes on the <a> tag, e.g. btn-lg.',
						'wrapper'     => [ 'width' => '50' ],
						'placeholder' => 'e.g. btn-lg',
					],
				],
			],
		],
	] );

	// ─────────────────────────────────────────────
	// COLUMN block fields
	// ─────────────────────────────────────────────
	acf_add_local_field_group( [
		'key'      => 'group_as_column',
		'title'    => 'Column Settings',
		'location' => [ [ [ 'param' => 'block', 'operator' => '==', 'value' => 'ahlfeld-solutions/column' ] ] ],
		'fields'   => [

			// Tab: Width
			[ 'key' => 'field_as_col_tab_width', 'label' => 'Width', 'type' => 'tab', 'placement' => 'top' ],

			[
				'key'           => 'field_as_col_xs',
				'label'         => 'Default (all screens)',
				'name'          => 'col_xs',
				'type'          => 'select',
				'default_value' => 'col',
				'choices'       => $col_xs_choices,
			],
			[
				'key'     => 'field_as_col_sm',
				'label'   => '≥ SM  (576px)',
				'name'    => 'col_sm',
				'type'    => 'select',
				'choices' => $col_bp( 'sm' ),
			],
			[
				'key'     => 'field_as_col_md',
				'label'   => '≥ MD  (768px)',
				'name'    => 'col_md',
				'type'    => 'select',
				'choices' => $col_bp( 'md' ),
			],
			[
				'key'     => 'field_as_col_lg',
				'label'   => '≥ LG  (992px)',
				'name'    => 'col_lg',
				'type'    => 'select',
				'choices' => $col_bp( 'lg' ),
			],
			[
				'key'     => 'field_as_col_xl',
				'label'   => '≥ XL  (1200px)',
				'name'    => 'col_xl',
				'type'    => 'select',
				'choices' => $col_bp( 'xl' ),
			],

			// Tab: Offset & Order
			[ 'key' => 'field_as_col_tab_offset', 'label' => 'Offset & Align', 'type' => 'tab', 'placement' => 'top' ],

			[
				'key'     => 'field_as_col_offset_md',
				'label'   => 'Offset ≥ MD',
				'name'    => 'col_offset_md',
				'type'    => 'select',
				'choices' => $offset_bp( 'md' ),
			],
			[
				'key'     => 'field_as_col_offset_lg',
				'label'   => 'Offset ≥ LG',
				'name'    => 'col_offset_lg',
				'type'    => 'select',
				'choices' => $offset_bp( 'lg' ),
			],
			[
				'key'     => 'field_as_col_align_self',
				'label'   => 'Align Self',
				'name'    => 'col_align_self',
				'type'    => 'select',
				'choices' => $align_self_choices,
			],

			// Tab: Advanced
			[ 'key' => 'field_as_col_tab_adv', 'label' => 'Advanced', 'type' => 'tab', 'placement' => 'top' ],

			[
				'key'         => 'field_as_col_classes',
				'label'       => 'Extra Classes',
				'name'        => 'col_extra_classes',
				'type'        => 'text',
				'placeholder' => 'e.g. d-flex flex-column',
			],
		],
	] );
}
