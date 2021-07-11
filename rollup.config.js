import typescript from 'rollup-plugin-typescript2'
import sourceMaps from 'rollup-plugin-sourcemaps'
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json'

export default {
    input: './index.ts',
    output: [
        {
            file: pkg.main,
            format: 'umd',
            sourcemap: true,
            name: 'unobtrusive-validation'
        }, {
            file: pkg.main.replace('.js', '.min.js'),
            format: 'umd',
            sourcemap: true,
            name: 'unobtrusive-validation',
            plugins: [
                terser({
                    compress: true,
                    mangle: true
                })
            ]
        }
    ],
    plugins: [
        typescript({
            typescript: require('typescript'),
        }),
        sourceMaps()
    ]
}
