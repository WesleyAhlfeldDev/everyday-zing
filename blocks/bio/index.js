import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit() {
		const blockProps = useBlockProps( { style: { background: '#1A1A1A', padding: '44px 28px', textAlign: 'center' } } );
		return (
			<div { ...blockProps }>
				<p style={ { color: '#555', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '14px' } }>A little about me</p>
				<p style={ { color: '#fff', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '22px' } }>
					I believe everyday life deserves a little <span style={ { color: '#C8E050' } }>zing</span>
				</p>
			</div>
		);
	},
	save: () => null,
} );
