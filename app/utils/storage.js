import uuid from 'uuid';

/**
 * 用到的storage集合（*为一定存在）
 * account      *用户账号
 * password     *用户密码
 * isSave       *是否保存用户信息（账号密码）
 * role         角色（权限标示符）
 * company      所属公司
 * department   所属部门
 */

// const STORAGE = window.localStorage;
const STORAGE = window.sessionStorage;
const STORAGE_KEY = 'app';

export function getAll() {
  return new Promise((resolve) => {
    const results = STORAGE.getItem(STORAGE_KEY);
    
    try {
      resolve(
        results ? JSON.parse(results) : []
      );
    } catch (e) {
      resolve([]);
    }
  });
}

export function saveAll(results) {
  return new Promise((resolve) => {
    STORAGE.setItem(STORAGE_KEY, JSON.stringify(results));
    resolve();
  });
}

export function getEntry(id) {
  return getAll()
    .then(
      results => results.find(
        // result => result.id === id
        result => result.title === id
      )
    );
}

export function insertEntry(title, content) {
  const entry = {
    title,
    content,
    id: uuid.v4(),
    time: new Date().getTime(),
  };

  return getAll()
    .then(results => [...results, entry])
    .then(saveAll)
    .then(() => entry);
}

export function deleteEntry(id) {
  return getAll()
    .then(
      results => results.filter(
        result => result.id !== id
      )
    )
    .then(saveAll);
}
/**
 * 输入id（uuidv4）
 */
export function updateEntry(id, title, content) {
  let entry;
  return getAll()
    .then(
      results => results.map(
        result => (
          result.id === id ?
            (entry = {...result, title, content}) : result
        )
      )
    )
    .then(saveAll)
    .then(() => entry);
}