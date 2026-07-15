import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import styles from '../../styles/AddBook.module.css';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'total_copies' || name === 'available_copies'
        ? parseInt(value) || 0
        : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
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
        alert('图书添加成功！');
        router.push(`/books/${data.book.id}`);
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
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="如：编程、文学、历史"
                  />
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
