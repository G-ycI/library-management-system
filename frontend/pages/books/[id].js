import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import styles from '../../styles/BookDetail.module.css';

const CATEGORIES = [
  '编程', '文学', '历史', '科学', '小说', '教育', '艺术', '经济',
  '哲学', '传记', '计算机', '数学', '物理', '化学', '生物', '医学',
  '法律', '心理', '社会', '政治', '军事', '地理', '天文', '音乐',
  '电影', '摄影', '美食', '旅行', '运动', '游戏', '漫画', '童话',
  '诗歌', '散文', '戏剧', '语言', '宗教', '建筑', '设计', '管理',
  '营销', '金融', '投资', '会计', '农业', '工业', '交通', '环境',
  '宠物', '育儿', '养生',
];

export default function BookDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showEditPasswordModal, setShowEditPasswordModal] = useState(false);
  const [editPassword, setEditPassword] = useState('');
  const [editPasswordError, setEditPasswordError] = useState('');
  const [verifyingPassword, setVerifyingPassword] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    description: '',
    total_copies: 1,
    available_copies: 1,
  });
  const [editErrors, setEditErrors] = useState({});
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [editCustomCategory, setEditCustomCategory] = useState(false);
  const [editShowCopiesAlert, setEditShowCopiesAlert] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBook();
    }
  }, [id]);

  const fetchBook = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/books/${id}`);
      if (!res.ok) {
        throw new Error('图书不存在');
      }
      const data = await res.json();
      setBook(data.book);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setDeletePassword('');
    setDeleteError('');
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeletePassword('');
    setDeleteError('');
  };

  const handleConfirmDelete = async () => {
    if (!deletePassword.trim()) {
      setDeleteError('请输入密码');
      return;
    }

    setDeleting(true);
    setDeleteError('');

    try {
      const res = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: deletePassword }),
      });

      if (res.ok) {
        router.push('/');
      } else {
        const data = await res.json();
        setDeleteError(data.error || '删除失败');
      }
    } catch (err) {
      setDeleteError('删除失败，请检查网络连接');
    } finally {
      setDeleting(false);
    }
  };

  const handleEditClick = () => {
    setShowEditPasswordModal(true);
    setEditPassword('');
    setEditPasswordError('');
  };

  const handleCancelEditPassword = () => {
    setShowEditPasswordModal(false);
    setEditPassword('');
    setEditPasswordError('');
  };

  const handleConfirmEditPassword = async () => {
    if (!editPassword.trim()) {
      setEditPasswordError('请输入密码');
      return;
    }

    setVerifyingPassword(true);
    setEditPasswordError('');

    try {
      const res = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: editPassword }),
      });

      if (res.status === 403) {
        const data = await res.json();
        setEditPasswordError(data.error || '密码错误');
      } else {
        setShowEditPasswordModal(false);
        setEditForm({
          title: book.title || '',
          author: book.author || '',
          isbn: book.isbn || '',
          category: book.category || '',
          description: book.description || '',
          total_copies: book.total_copies || 1,
          available_copies: book.available_copies || 1,
        });
        setEditErrors({});
        setEditCustomCategory(!CATEGORIES.includes(book.category));
        setShowEditModal(true);
      }
    } catch (err) {
      setEditPasswordError('验证失败，请检查网络连接');
    } finally {
      setVerifyingPassword(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...editForm,
      [name]: name === 'total_copies' || name === 'available_copies'
        ? parseInt(value) || 0
        : value,
    };

    if (name === 'available_copies' && newFormData.available_copies > newFormData.total_copies) {
      setEditShowCopiesAlert(true);
      setTimeout(() => setEditShowCopiesAlert(false), 2000);
    }

    if (name === 'total_copies' && newFormData.available_copies > newFormData.total_copies) {
      newFormData.available_copies = newFormData.total_copies;
    }

    setEditForm(newFormData);

    if (editErrors[name]) {
      setEditErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleEditCategoryChange = (e) => {
    const value = e.target.value;
    if (value === '__custom__') {
      setEditCustomCategory(true);
      setEditForm((prev) => ({ ...prev, category: '' }));
    } else {
      setEditCustomCategory(false);
      setEditForm((prev) => ({ ...prev, category: value }));
    }
    if (editErrors.category) {
      setEditErrors((prev) => ({ ...prev, category: '' }));
    }
  };

  const validateEditForm = () => {
    const newErrors = {};
    if (!editForm.title.trim()) {
      newErrors.title = '请输入书名';
    }
    if (!editForm.author.trim()) {
      newErrors.author = '请输入作者';
    }
    if (editForm.total_copies < 1) {
      newErrors.total_copies = '馆藏数量不能小于1';
    }
    if (editForm.available_copies < 0) {
      newErrors.available_copies = '可借数量不能小于0';
    }
    if (editForm.available_copies > editForm.total_copies) {
      newErrors.available_copies = '可借数量不能超过馆藏数量';
    }
    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditErrors({});
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!validateEditForm()) return;

    setSubmittingEdit(true);
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...editForm, password: editPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setShowEditModal(false);
        setEditPassword('');
        fetchBook();
      } else {
        if (data.error) {
          alert(data.error);
        } else {
          alert('更新失败，请重试');
        }
      }
    } catch (err) {
      alert('更新失败，请检查网络连接');
    } finally {
      setSubmittingEdit(false);
    }
  };

  return (
    <div>
      <Head>
        <title>{book ? `${book.title} - 图书详情` : '图书详情'}</title>
      </Head>
      <Header />
      <main className="container">
        <div className={styles.mainContent}>
          <Link href="/" className={styles.backLink}>
            ← 返回列表
          </Link>

          {loading ? (
            <div className={styles.loading}>加载中...</div>
          ) : error ? (
            <div className={styles.error}>
              <p>{error}</p>
              <Link href="/" className={styles.backBtn}>
                返回列表
              </Link>
            </div>
          ) : book ? (
            <div className={styles.detailCard}>
              <div className={styles.bookHeader}>
                <h1 className={styles.title}>{book.title}</h1>
                {book.category && (
                  <span className={styles.category}>{book.category}</span>
                )}
              </div>

              <div className={styles.bookInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>作者</span>
                  <span className={styles.value}>{book.author}</span>
                </div>
                {book.isbn && (
                  <div className={styles.infoRow}>
                    <span className={styles.label}>ISBN</span>
                    <span className={styles.value}>{book.isbn}</span>
                  </div>
                )}
                <div className={styles.infoRow}>
                  <span className={styles.label}>馆藏数量</span>
                  <span className={styles.value}>{book.total_copies} 本</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>可借数量</span>
                  <span
                    className={
                      book.available_copies > 0
                        ? styles.inStock
                        : styles.outOfStock
                    }
                  >
                    {book.available_copies} 本
                  </span>
                </div>
                {book.created_at && (
                  <div className={styles.infoRow}>
                    <span className={styles.label}>入库时间</span>
                    <span className={styles.value}>
                      {new Date(book.created_at).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                )}
              </div>

              {book.description && (
                <div className={styles.description}>
                  <h3 className={styles.descTitle}>内容简介</h3>
                  <p className={styles.descText}>{book.description}</p>
                </div>
              )}

              <div className={styles.actions}>
                <button onClick={handleEditClick} className={styles.editBtn}>
                  编辑图书
                </button>
                <button onClick={handleDeleteClick} className={styles.deleteBtn}>
                  删除图书
                </button>
              </div>
            </div>
          ) : null}

          {showDeleteModal && book && (
            <div className={styles.modalOverlay} onClick={handleCancelDelete}>
              <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.modalTitle}>确认删除</h2>
                <p className={styles.modalText}>
                  确定要删除《{book.title}》吗？此操作不可撤销。
                </p>
                <div className={styles.formGroup}>
                  <label className={styles.modalLabel}>请输入管理员密码</label>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className={styles.modalInput}
                    placeholder="请输入密码"
                    onKeyDown={(e) => e.key === 'Enter' && handleConfirmDelete()}
                  />
                  {deleteError && (
                    <p className={styles.modalError}>{deleteError}</p>
                  )}
                </div>
                <div className={styles.modalActions}>
                  <button
                    onClick={handleCancelDelete}
                    className={styles.cancelBtn}
                    disabled={deleting}
                  >
                    取消
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className={styles.confirmDeleteBtn}
                    disabled={deleting}
                  >
                    {deleting ? '删除中...' : '确认删除'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showEditPasswordModal && book && (
            <div className={styles.modalOverlay} onClick={handleCancelEditPassword}>
              <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.modalTitle}>编辑图书</h2>
                <p className={styles.modalText}>
                  请输入管理员密码以编辑《{book.title}》。
                </p>
                <div className={styles.formGroup}>
                  <label className={styles.modalLabel}>请输入管理员密码</label>
                  <input
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className={styles.modalInput}
                    placeholder="请输入密码"
                    onKeyDown={(e) => e.key === 'Enter' && handleConfirmEditPassword()}
                  />
                  {editPasswordError && (
                    <p className={styles.modalError}>{editPasswordError}</p>
                  )}
                </div>
                <div className={styles.modalActions}>
                  <button
                    onClick={handleCancelEditPassword}
                    className={styles.cancelBtn}
                    disabled={verifyingPassword}
                  >
                    取消
                  </button>
                  <button
                    onClick={handleConfirmEditPassword}
                    className={styles.confirmEditBtn}
                    disabled={verifyingPassword}
                  >
                    {verifyingPassword ? '验证中...' : '确认'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showEditModal && book && (
            <div className={styles.modalOverlay} onClick={handleCancelEdit}>
              <div className={`${styles.modal} ${styles.editModal}`} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.modalTitle}>编辑图书</h2>
                <form onSubmit={handleSubmitEdit}>
                  <div className={styles.editFormRow}>
                    <div className={styles.editFormGroup}>
                      <label className={styles.editLabel}>
                        书名 <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={editForm.title}
                        onChange={handleEditChange}
                        className={`${styles.editInput} ${
                          editErrors.title ? styles.inputError : ''
                        }`}
                        placeholder="请输入书名"
                      />
                      {editErrors.title && (
                        <p className={styles.editErrorText}>{editErrors.title}</p>
                      )}
                    </div>

                    <div className={styles.editFormGroup}>
                      <label className={styles.editLabel}>
                        作者 <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        name="author"
                        value={editForm.author}
                        onChange={handleEditChange}
                        className={`${styles.editInput} ${
                          editErrors.author ? styles.inputError : ''
                        }`}
                        placeholder="请输入作者"
                      />
                      {editErrors.author && (
                        <p className={styles.editErrorText}>{editErrors.author}</p>
                      )}
                    </div>
                  </div>

                  <div className={styles.editFormRow}>
                    <div className={styles.editFormGroup}>
                      <label className={styles.editLabel}>ISBN</label>
                      <input
                        type="text"
                        name="isbn"
                        value={editForm.isbn}
                        onChange={handleEditChange}
                        className={styles.editInput}
                        placeholder="请输入ISBN"
                      />
                    </div>

                    <div className={styles.editFormGroup}>
                      <label className={styles.editLabel}>分类</label>
                      {!editCustomCategory ? (
                        <select
                          name="category"
                          value={editForm.category || ''}
                          onChange={handleEditCategoryChange}
                          className={styles.editSelect}
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
                        <div className={styles.editCustomCatWrap}>
                          <input
                            type="text"
                            name="category"
                            value={editForm.category}
                            onChange={handleEditChange}
                            className={styles.editInput}
                            placeholder="请输入自定义分类名称"
                          />
                          <button
                            type="button"
                            className={styles.editBackSelectBtn}
                            onClick={() => {
                              setEditCustomCategory(false);
                              setEditForm((prev) => ({ ...prev, category: '' }));
                            }}
                          >
                            返回
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.editFormRow}>
                    <div className={styles.editFormGroup}>
                      <label className={styles.editLabel}>馆藏数量</label>
                      <input
                        type="number"
                        name="total_copies"
                        value={editForm.total_copies}
                        onChange={handleEditChange}
                        className={`${styles.editInput} ${
                          editErrors.total_copies ? styles.inputError : ''
                        }`}
                        min="1"
                      />
                      {editErrors.total_copies && (
                        <p className={styles.editErrorText}>{editErrors.total_copies}</p>
                      )}
                    </div>

                    <div className={styles.editFormGroup}>
                      <label className={styles.editLabel}>可借数量</label>
                      <div className={styles.editInputWrap}>
                        <input
                          type="number"
                          name="available_copies"
                          value={editForm.available_copies}
                          onChange={handleEditChange}
                          className={`${styles.editInput} ${
                            editErrors.available_copies ? styles.inputError : ''
                          }`}
                          min="0"
                        />
                        {editShowCopiesAlert && (
                          <div className={styles.editCopiesAlert}>
                            ⚠ 可借数量不能大于馆藏数量
                          </div>
                        )}
                      </div>
                      {editErrors.available_copies && (
                        <p className={styles.editErrorText}>
                          {editErrors.available_copies}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className={styles.editFormGroup}>
                    <label className={styles.editLabel}>内容简介</label>
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      className={styles.editTextarea}
                      rows="4"
                      placeholder="请输入图书内容简介"
                    />
                  </div>

                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className={styles.cancelBtn}
                      disabled={submittingEdit}
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className={styles.confirmEditBtn}
                      disabled={submittingEdit}
                    >
                      {submittingEdit ? '保存中...' : '保存修改'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
