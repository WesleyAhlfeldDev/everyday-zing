import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit() {
		const blockProps = useBlockProps( { className: 'marquee-block-preview' } );
		return (
			<div { ...blockProps } style={ { background: '#1A1A1A', padding: '11px 28px', color: '#888', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' } }>
				Food &nbsp;● &nbsp; Finance &nbsp;● &nbsp; Travel &nbsp;● &nbsp; Every Day Zing &nbsp;● &nbsp; Real Life. Real Joy.
			</div>
		);
	},
	save: () => null,
} );
