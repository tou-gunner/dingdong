const path = require("path");
const fs = require("fs");

/**
 * 使用分包功能时，需要在相应页面中增加 componentPlaceholder 配置，key 值为分包中的组件名称，value 值默认为 view 即可
 * 由于 uniapp 将组件编译之后，名称转为短横线连接，因此在 componentPlaceholder 中不能使用驼峰命名，只能使用短横线连接
 * 例如组件 <diyPage /> 在 componentPlaceholder 中需要写成 "diy-page" 而不是 "diyPage"
 * 具体可参考 /pages/index/index.vue 文件中的 componentPlaceholder 配置
 * 
 * 增加自定义组件时，需要在分包 index 页面中引入组件，避免编译时由于无引用导致组件被 tree-shaking
 * 
 * 参考文件: /sub-packages/diy/index.vue
 * 参考链接： https://juejin.cn/post/7501895184972709897
 * 
 * 可以添加分包 root name 至 page.json preloadRule 中实现分包预加载
 */

// 源码根路径
const buildInputDirPath = process.env.UNI_INPUT_DIR;

// 构建平台
const buildPlatform = process.env.UNI_PLATFORM;

// 判断是否为小程序平台
const isMiniProgram = buildPlatform === "mp-weixin";

// 收集组件配置
function collectComponentsConfig(dirPath, config = {}) {
  // 读取指定目录下的所有文件
  const files = fs.readdirSync(dirPath);

  for (const fileName of files) {
    const filePath = path.join(dirPath, fileName);

    if (fs.statSync(filePath).isDirectory()) {
      // 如果是目录，则递归调用处理函数
      collectComponentsConfig(filePath, config);
    } else if (path.extname(fileName) === ".vue") {
      // 如果是 vue 文件，则读取组件内容，并进行处理
      const fileContent = fs.readFileSync(filePath, "utf-8");

      // 匹配组件中的 componentPlaceholder 信息
      const match = fileContent.match(/componentPlaceholder\s*[:=]\s*{([\s\S]*?)}/);

      // 如果没有匹配到响应关键字，则不做处理
      if (!match || !match[1]) continue;

      // 获取当前 vue 文件和源码文件的相对路径
      const fileRelativePath = path.relative(buildInputDirPath, filePath);

      // 获取当前 vue 文件在构建输出目录下的路径
      // 并将 .vue 后缀名修改成 .json 后缀名，以便对该组件在小程序中的配置进行处理
      const buildFilePath = fileRelativePath
        .replace(/\\/g, "/") // 将 win32 风格路径转为 posix 风格
        .replace(/\.(vue)/g, ".json");

      const placeholderStr = match[1].trim()
        .replace(/,\s*$/, "") // 清理最后一个配置项的逗号
        .replace(/\r?\n|\t/g, "") // 清理换行符和制表符
        .replace(/(['"])?([A-Za-z0-9-]+)\1\s*:/g, '"$2":') // 将 key 的单引号转换成双引号
        .replace(/'/g, '"'); // 将 value 的单引号转换成双引号

      config[buildFilePath] = JSON.parse(`{${placeholderStr}}`);
    }
  }

  return config;
}

class UniComponentPlaceholder {
  apply(compiler) {
    // 如果当前构建的平台不是小程序平台，则直接返回
    if (!isMiniProgram) return;

    // 监听 emit 钩子，对组件内文件进行处理
    console.log("uni-placholder hook init...");
    compiler.hooks.emit.tapAsync("uniComponentPlaceholder", (compilation, callback) => {
      // 只对 pages 目录下的文件进行处理，收集组件配置
      const componentConfig = collectComponentsConfig(path.resolve(buildInputDirPath, "pages"));
      for (const filename of Object.keys(compilation.assets)) {
        if (componentConfig[filename]) {
          // 获取原始内容
          const originConfig = JSON.parse(compilation.assets[filename].source());
          // 修改内容
          originConfig.componentPlaceholder = componentConfig[filename];
          // 更新 asset

          const modifiedContent = JSON.stringify(originConfig, null, 4);
          compilation.assets[filename] = {
            source: () => modifiedContent,
            size: () => Buffer.byteLength(modifiedContent, 'utf8')
          };
        }
      }

      setTimeout(() => {
        console.log("uni-placholder hook end...");
        callback();
      }, 2000);
    });
  }
}

module.exports = UniComponentPlaceholder;