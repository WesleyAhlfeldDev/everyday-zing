( function ( blocks, blockEditor ) {
	var el = window.React.createElement;

	blocks.registerBlockType( 'ahlfeld-solutions/buttons', {
		edit: function () {
			var blockProps = blockEditor.useBlockProps( {
				style: {
					border: '2px dashed #C8E050',
					padding: '12px 16px',
					background: 'rgba(200,224,80,0.06)',
					borderRadius: '6px',
					textAlign: 'center',
				},
			} );
			return el( 'div', blockProps,
				el( 'strong', {
					style: {
						fontSize: '11px',
						letterSpacing: '.1em',
						textTransform: 'uppercase',
						color: '#4E6A10',
					},
				}, 'Buttons — configure in the sidebar' )
			);
		},
		save: function () {
			return null;
		},
	} );
} )( window.wp.blocks, window.wp.blockEditor );
