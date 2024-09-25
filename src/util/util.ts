import JSZip from 'jszip';

interface ValidationResult {
  isValid: boolean;
  error: string | null;
  shpCount: number;
  validFiles: string[];
}

export async function validateZipShapefile(file: File | undefined): Promise<ValidationResult> {
  // 检查文件是否存在
  if (!file) {
    return { isValid: false, error: '未选择文件。', shpCount: 0, validFiles: [] };
  }

  try {
    // 使用 JSZip 解压 ZIP 文件
    const zip = await JSZip.loadAsync(file);
    const fileNames = Object.keys(zip.files);

    let shpCount = 0;
    const requiredExtensions = ['.shp', '.dbf', '.shx', '.prj'];
    const errors: string[] = [];

    // 遍历文件，检查文件类型
    for (const fileName of fileNames) {
      const ext = fileName.slice(-4).toLowerCase();
      if (ext === '.shp') {
        shpCount++;

        // 检查对应的 .dbf, .shx, .prj 文件是否存在
        if (!fileNames.includes(fileName.replace('.shp', '.dbf'))) {
          errors.push(`缺少 ${fileName.replace('.shp', '.dbf')} 文件。`);
        }
        if (!fileNames.includes(fileName.replace('.shp', '.shx'))) {
          errors.push(`缺少 ${fileName.replace('.shp', '.shx')} 文件。`);
        }
        if (!fileNames.includes(fileName.replace('.shp', '.prj'))) {
          errors.push(`缺少 ${fileName.replace('.shp', '.prj')} 文件。`);
        }
      }
    }

    // 检查是否有 .shp、.dbf、.shx 和 .prj 文件
    if (shpCount == 0) {
      return {
        isValid: false,
        error: 'zip压缩包中无Shapefile文件',
        shpCount: 0,
        validFiles: [],
      };
    } else if (shpCount > 0 && errors.length === 0) {
      return { isValid: true, error: null, shpCount: shpCount, validFiles: fileNames };
    } else {
      return { isValid: false, error: errors.join(' '), shpCount: shpCount, validFiles: fileNames };
    }
  } catch (error) {
    return {
      isValid: false,
      error: '解析文件失败：' + (error as Error).message,
      shpCount: 0,
      validFiles: [],
    }; // 返回解析错误
  }
}
