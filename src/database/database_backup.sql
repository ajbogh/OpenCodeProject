/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: posts
# ------------------------------------------------------------

INSERT INTO
  `posts` (
    `id`,
    `title`,
    `author`,
    `created_datetime`,
    `updated_datetime`,
    `category`,
    `markdown`
  )
VALUES
  (
    1,
    'Vanilla JS SPA using web-components',
    1,
    '2021-04-30 08:59:38',
    '2021-04-30 08:59:38',
    'Articles',
    'The **Open Code Project** is being developed as an SPA using Vanilla JS instead of a framework like React or Angular.'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: users
# ------------------------------------------------------------

INSERT INTO
  `users` (
    `id`,
    `display_name`,
    `email`,
    `password`,
    `create_time`,
    `is_admin`
  )
VALUES
  (
    1,
    'ajbogh',
    'ajbogh@allanbogh.com',
    'test',
    '2021-04-30 08:55:35',
    1
  );

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
