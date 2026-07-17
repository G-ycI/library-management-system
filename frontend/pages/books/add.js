import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import styles from '../../styles/AddBook.module.css';

const CATEGORIES = [
  '编程', '文学', '历史', '科学', '小说', '教育', '艺术', '经济',
  '哲学', '传记', '计算机', '数学', '物理', '化学', '生物', '医学',
  '法律', '心理', '社会', '政治', '军事', '地理', '天文', '音乐',
  '电影', '摄影', '美食', '旅行', '运动', '游戏', '漫画', '童话',
  '诗歌', '散文', '戏剧', '语言', '宗教', '建筑', '设计', '管理',
  '营销', '金融', '投资', '会计', '农业', '工业', '交通', '环境',
  '宠物', '育儿', '养生',
];

export default function AddBook() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    description: '',
    total_copies: 1,
    available_copies: 1,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [customCategory, setCustomCategory] = useState(false);
  const [showCopiesAlert, setShowCopiesAlert] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: name === 'total_copies' || name === 'available_copies'
        ? parseInt(value) || 0
        : value,
    };

    if (name === 'available_copies' && newFormData.available_copies > newFormData.total_copies) {
      setShowCopiesAlert(true);
      setTimeout(() => setShowCopiesAlert(false), 2000);
    }

    if (name === 'total_copies' && newFormData.available_copies > newFormData.total_copies) {
      newFormData.available_copies = newFormData.total_copies;
    }

    setFormData(newFormData);

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === '__custom__') {
      setCustomCategory(true);
      setFormData((prev) => ({ ...prev, category: '' }));
    } else {
      setCustomCategory(false);
      setFormData((prev) => ({ ...prev, category: value }));
    }
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = '请输入书名';
    }
    if (!formData.author.trim()) {
      newErrors.author = '请输入作者';
    }
    if (formData.total_copies < 1) {
      newErrors.total_copies = '馆藏数量不能小于1';
    }
    if (formData.available_copies < 0) {
      newErrors.available_copies = '可借数量不能小于0';
    }
    if (formData.available_copies > formData.total_copies) {
      newErrors.available_copies = '可借数量不能超过馆藏数量';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        if (data && data.book && data.book.id) {
          router.push(`/books/${data.book.id}`);
        } else {
          router.push('/');
        }
      } else {
        if (data.error) {
          alert(data.error);
        } else {
          alert('添加失败，请重试');
        }
      }
    } catch (err) {
      alert('添加失败，请检查网络连接');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Head>
        <title>新增图书 - 图书管理系统</title>
      </Head>
      <Header />
      <main className="container">
        <div className={styles.mainContent}>
          <Link href="/" className={styles.backLink}>
            ← 返回列表
          </Link>

          <div className={styles.formCard}>
            <h1 className={styles.pageTitle}>新增图书</h1>
            <p className={styles.subtitle}>填写图书信息，带 * 为必填项</p>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    书名 <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`${styles.input} ${
                      errors.title ? styles.inputError : ''
                    }`}
                    placeholder="请输入书名"
                  />
                  {errors.title && (
                    <p className={styles.errorText}>{errors.title}</p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    作者 <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className={`${styles.input} ${
                      errors.author ? styles.inputError : ''
                    }`}
                    placeholder="请输入作者"
                  />
                  {errors.author && (
                    <p className={styles.errorText}>{errors.author}</p>
                  )}
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>ISBN</label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="请输入ISBN"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>分类</label>
                  {!customCategory ? (
                    <select
                      name="category"
                      value={formData.category || ''}
                      onChange={handleCategoryChange}
                      className={styles.select}
                    >
                      <option value="">请选择分类</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="__custom__">+ 自定义分类</option>
                    </select>
                  ) : (
                    <div className={styles.customCategoryWrap}>
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="请输入自定义分类名称"
                        autoFocus
                      />
                      <button
                        type="button"
                        className={styles.backToSelectBtn}
                        onClick={() => {
                          setCustomCategory(false);
                          setFormData((prev) => ({ ...prev, category: '' }));
                        }}
                      >
                        返回选择
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>馆藏数量</label>
                  <input
                    type="number"
                    name="total_copies"
                    value={formData.total_copies}
                    onChange={handleChange}
                    className={`${styles.input} ${
                      errors.total_copies ? styles.inputError : ''
                    }`}
                    min="1"
                  />
                  {errors.total_copies && (
                    <p className={styles.errorText}>{errors.total_copies}</p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>可借数量</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="number"
                      name="available_copies"
                      value={formData.available_copies}
                      onChange={handleChange}
                      className={`${styles.input} ${
                        errors.available_copies ? styles.inputError : ''
                      }`}
                      min="0"
                    />
                    {showCopiesAlert && (
                      <div className={styles.copiesAlert}>
                        ⚠ 可借数量不能大于馆藏数量
                      </div>
                    )}
                  </div>
                  {errors.available_copies && (
                    <p className={styles.errorText}>
                      {errors.available_copies}
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>内容简介</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={styles.textarea}
                  rows="5"
                  placeholder="请输入图书内容简介"
                />
              </div>

              <div className={styles.actions}>
                <Link href="/" className={styles.cancelBtn}>
                  取消
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className={styles.submitBtn}
                >
                  {submitting ? '提交中...' : '添加图书'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
