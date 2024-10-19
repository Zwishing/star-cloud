import { UploadFile } from 'antd';
import JSZip from 'jszip';
import { createHash } from 'crypto';

interface ValidationResult {
  isValid: boolean;
  error: string | null;
  shpCount: number;
  validFiles: string[];
}

export async function validateZipShapefile(file: UploadFile): Promise<ValidationResult> {
  try {
    // 使用 JSZip 解压 ZIP 文件
    const zip = await JSZip.loadAsync(file);
    const fileNames = Object.keys(zip.files);

    let shpCount = 0;
    // const requiredExtensions = ['.shp', '.dbf', '.shx', '.prj'];
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
    if (shpCount === 0) {
      return {
        isValid: false,
        error: `${file.name}中无Shapefile文件`,
        shpCount: 0,
        validFiles: [],
      };
    } else {
      return { isValid: true, error: null, shpCount: shpCount, validFiles: fileNames };
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

export function formatFileSize(size: number | undefined) {
  if (size === undefined) return '';
  if (size === 0) return '0 KB';
  if (size >= 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  } else if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  } else {
    return `${(size / 1024).toFixed(1)} KB`;
  }
}

export function hashPassword(password: string): string {
  return createHash('md5').update(password).digest('hex');
}

export function removeFileExtension(filename:string) {
  if (filename === undefined || filename === '' || filename === null){
    return "";
  }
  return filename.split('.').slice(0, -1).join('.');
}
