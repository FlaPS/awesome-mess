import initStoryshots, {renderOnly} from '@storybook/addon-storyshots';

(global as any).window = global
window.addEventListener = () => {
}
window.requestAnimationFrame = () => {
    throw new Error('requestAnimationFrame is not supported in Node')
}

initStoryshots({
    framework: 'react',
    test: renderOnly,
})
