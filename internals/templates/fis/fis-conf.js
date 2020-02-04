const Path = require('path');

// 初始化 F.I.S 配置项
fis.set('project.ignore', [
  '.babelrc',
  '.editorconfig',
  '.eslintignore',
  '.eslintrc',
  '.gitattributes',
  '.gitignore',
  '.travis.yml',
  '.yarnclean',
  '.git/**',
  '.svn/**',
  'fis-conf.*',
  'package.json',
  'yarn.lock',
  'LICENSE',
  'README.md',
  // project ignore files
  'dist/**',
]);

// 压缩html的默认设置
const HTML_MINIFIER_OPTIONS = {
  templatePattern: '',
  ignorePattern: '',
  // @see https://github.com/kangax/html-minifier#options-quick-reference
  removeComments: true,
  collapseWhitespace: true,
  removeRedundantAttributes: true,
  useShortDoctype: true,
  removeEmptyAttributes: true,
  removeStyleLinkTypeAttributes: true,
  keepClosingSlash: true,
  minifyJS: true,
  minifyCSS: true,
  minifyURLs: true,
};

fis.match('/pages/(**.html)', {
  release: '/$1',
});

// ------ 配置hook
// fis3 中预设的是 fis-components，这里不需要，所以先关了。
fis.unhook('components');

// fis3 对npm的node_modules模块的支持
fis.hook('node_modules', {
  // 默认为 false 标记是否忽略 devDependencies
  ignoreDevDependencies: true,
});

fis.hook('commonjs', {
  // paths: {
  //   modjs: './node_modules/fis-mod.js/mod.js',
  //   $: './node_modules/jquery/dist/jquery.js',
  //   jQuery: './node_modules/jquery/dist/jquery.js'
  // },
  packages: [
    {
      name: 'jquery',
      location: './node_modules/jquery/dist/',
      main: 'jquery.js'
    },
    {
      name: 'process',
      location: './node_modules/process/',
      main: 'index.js'
    }
  ]
})

// 为node_modules文件添加针对mod.js的转换
fis
  .match('/node_modules/**', {
    release: false,
  })
  .match('/node_modules/**.js', {
    isMod: true,
    useSameNameRequire: true,
  })
  .match('/node_modules/({' +
    'fis-mod.js/mod.js,' +
    'jquery/dist/jquery.js,' +
    'jquery-validation/dist/**,' +
    'process/browser.js,' +
    'process/index.js,' +
    'moment/locale/**,' +
    'moment/moment.js' +
  '})', {
    release: '/assets/scripts/$1'
  })
  .match('/node_modules/jquery-validation/dist/**', {
    requires: [
      'jquery'
    ]
  })
  .match('/node_modules/fis-mod.js/mod.js', {
    isMod: false,
    // !!! import
    // 用来控制合并时的顺序，值越小越在前面。配合 packTo 一起使用
    packOrder: -100
  })
  .match('/node_modules/{' +
    'fis-mod.js/mod.js,' +
    'process/browser.js,' +
    'jquery/dist/jquery.js' +
  '}', {
    packTo: '/assets/scripts/vendors.js'
  });

// 因为是纯前端项目，依赖不能自断被加载进来，所以这里需要借助一个 loader 来完成，
// 注意：与后端结合的项目不需要此插件!!!
fis.match('::package', {
  // npm install [-g] fis3-postpackager-loader
  // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
  postpackager: fis.plugin('loader', {
    resourceType: 'commonjs',
    processor: {
      '.html': 'html'
    },
    sourceMap: true, //是否生成依赖map文件
    useInlineMap: true, // 资源映射表内嵌
    resourcemapWhitespace: 2 // resourcemap缩进宽度, 默认为2.
  })
});

// ------ *.html:js & *.html:css
fis.match('**.html:js', {
  parser: fis.plugin('babel-6.x'),
});

fis.match('/pages/(**.{js,es})', {
  parser: fis.plugin('babel-6.x'),
  rExt: 'js',
  isMod: true,
  release: '/assets/scripts/$1',
  preprocessor: [
    fis.plugin('js-require-css'),
    fis.plugin('js-require-file', {
      useEmbedWhenSizeLessThan: 10 * 1024 // 小于10k用base64
    })
  ]
})

// deploy config
fis.match('*', {
  deploy: [
    // fis.plugin('html-minifier', HTML_MINIFIER_OPTIONS),
    fis.plugin('skip-packed'),
    fis.plugin('local-deliver', {
      to: Path.resolve(__dirname, './dist'),
    }),
  ],
});


