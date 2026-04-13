import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getCollections } from "../services/catalogService";
import { resolveImageUrl } from "../utils/image";
import "../CSS/boSuuTap.css";

const getId = (value) => value?.$oid ?? value?._id?.$oid ?? value?._id ?? value;

const toLines = (text) => String(text || "").split("\n");

const CollectionCard = ({ collection }) => {
  const image = resolveImageUrl(
    collection?.thumbnailImage?.[0] || "/no-image.png",
  );

  return (
    <Link to={`/bo-suu-tap/${collection.slug}`} className="collection-card">
      <div className="collection-card__image-wrap">
        <img
          src={image}
          alt={collection.tenBoSuuTap}
          className="collection-card__image"
        />
      </div>
      <div className="collection-card__body">
        <p className="collection-card__eyebrow">Bộ sưu tập</p>
        <h2 className="collection-card__title">{collection.tenBoSuuTap}</h2>
        {collection.slogan && (
          <p className="collection-card__slogan">
            {toLines(collection.slogan).map((line, index) => (
              <span key={index}>
                {line}
                {index < toLines(collection.slogan).length - 1 && <br />}
              </span>
            ))}
          </p>
        )}
        {collection.gioiThieu && (
          <p className="collection-card__desc">{collection.gioiThieu}</p>
        )}
        <span className="collection-card__cta">Khám phá ngay</span>
      </div>
    </Link>
  );
};

export default function BoSuuTapPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getCollections()
      .then((data) => {
        if (!mounted) return;
        setCollections(
          Array.isArray(data) ? data.filter((item) => item.isActive) : [],
        );
      })
      .catch(() => {
        if (mounted) setCollections([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const visibleCollections = collections.filter((collection) =>
    getId(collection._id),
  );

  return (
    <div className="collection-page">
      <section className="collection-page__hero">
        <div className="collection-page__hero-copy">
          {/* <p className="collection-page__kicker">Khám phá theo chủ đề</p> */}
          <h1 className="collection-page__title">
            <i>Khám phá bộ sưu tập</i>
          </h1>
          <p className="collection-page__lead">
            Những câu chuyện thời trang được dựng thành từng bộ sưu tập riêng,
            mỗi bộ sưu tập dẫn tới một không gian sản phẩm đầy đủ hơn ở bên
            trong.
          </p>
        </div>
      </section>

      {loading ? (
        <div className="collection-page__state">Đang tải bộ sưu tập...</div>
      ) : visibleCollections.length ? (
        <div className="collection-grid">
          {visibleCollections.map((collection) => (
            <CollectionCard
              key={collection._id?.$oid || collection._id || collection.slug}
              collection={collection}
            />
          ))}
        </div>
      ) : (
        <div className="collection-page__state">Chưa có bộ sưu tập nào.</div>
      )}
    </div>
  );
}
